import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import os from "os";
import { pipeline } from "stream/promises";
import { randomUUID } from "crypto";
import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";

import {
    downloadObject,
    uploadObject,
    deletePrefix,
} from "../../lib/storage.js";
import * as trackDao from "../track/track.dao.js";
import { emit } from "./sse.js";

// Resolve ffmpeg binary: env override > ffmpeg-static > system PATH
const ffmpegPath = process.env.FFMPEG_PATH || ffmpegStatic;
if (ffmpegPath) ffmpeg.setFfmpegPath(ffmpegPath);
console.log("[hls] ffmpeg path =", ffmpegPath || "(system PATH)");

const QUALITIES = [
    { name: "low", bitrate: 96, bandwidth: 96000 },
    { name: "medium", bitrate: 160, bandwidth: 160000 },
    { name: "high", bitrate: 320, bandwidth: 320000 },
];

const HLS_SEGMENT_SECONDS = 10;

const updateProgress = async (trackId, payload) => {
    await trackDao.updateStatus(trackId, payload).catch(() => { });
    emit(trackId, payload);
};

const downloadToFile = async (key, filePath) => {
    const stream = await downloadObject(key);
    await pipeline(stream, fs.createWriteStream(filePath));
};

const transcodeToHls = (inputFile, outDir, q) =>
    new Promise((resolve, reject) => {
        const playlist = path.join(outDir, `${q.name}.m3u8`);
        const segmentPattern = path.join(outDir, `${q.name}_%03d.ts`);

        ffmpeg(inputFile)
            .noVideo()
            .audioCodec("aac")
            .audioBitrate(`${q.bitrate}k`)
            .outputOptions([
                "-vn",
                "-start_number 0",
                `-hls_time ${HLS_SEGMENT_SECONDS}`,
                "-hls_list_size 0",
                "-hls_segment_type mpegts",
                `-hls_segment_filename ${segmentPattern}`,
                "-f hls",
            ])
            .output(playlist)
            .on("start", (cmd) => console.log(`[hls] ${q.name}: ${cmd}`))
            .on("end", () => resolve())
            .on("error", (err, _stdout, stderr) => {
                console.error(`[hls] ffmpeg ${q.name} failed:`, err.message);
                if (stderr) console.error(stderr);
                reject(err);
            })
            .run();
    });

const buildMasterPlaylist = () => {
    const lines = ["#EXTM3U", "#EXT-X-VERSION:3"];
    for (const q of QUALITIES) {
        lines.push(
            `#EXT-X-STREAM-INF:BANDWIDTH=${q.bandwidth},CODECS="mp4a.40.2"`
        );
        lines.push(`${q.name}.m3u8`);
    }
    return lines.join("\n") + "\n";
};

const uploadDirectory = async (localDir, s3Prefix) => {
    const entries = await fsp.readdir(localDir);
    for (const name of entries) {
        const full = path.join(localDir, name);
        const stat = await fsp.stat(full);
        if (!stat.isFile()) continue;
        const body = await fsp.readFile(full);
        const contentType = name.endsWith(".m3u8")
            ? "application/vnd.apple.mpegurl"
            : name.endsWith(".ts")
                ? "video/mp2t"
                : "application/octet-stream";
        await uploadObject(`${s3Prefix}${name}`, body, contentType);
    }
};

/**
 * Full pipeline: download -> transcode 3 qualities -> master playlist -> upload all -> mark ready.
 * Designed to be fire-and-forget. Never throws to caller; emits "failed" on error.
 */
export const processSongHls = async (trackId, sourceKey, userId) => {
    const workDir = await fsp.mkdtemp(path.join(os.tmpdir(), `hls-${trackId}-`));
    const inputPath = path.join(workDir, `input${path.extname(sourceKey) || ".mp3"}`);
    const basePath = `hls/${userId}/${trackId}/`;

    try {
        await updateProgress(trackId, {
            status: "processing",
            progress: 5,
            statusMessage: "Downloading source",
        });

        await downloadToFile(sourceKey, inputPath);

        await updateProgress(trackId, {
            status: "processing",
            progress: 15,
            statusMessage: "Transcoding qualities",
        });

        // Transcode each quality (sequential — keeps CPU pressure predictable)
        for (let i = 0; i < QUALITIES.length; i++) {
            const q = QUALITIES[i];
            await transcodeToHls(inputPath, workDir, q);
            const pct = 15 + Math.round(((i + 1) / QUALITIES.length) * 45); // 15 -> 60
            await updateProgress(trackId, {
                status: "chunking",
                progress: pct,
                statusMessage: `Chunked ${q.name} (${q.bitrate}kbps)`,
            });
        }

        // Master playlist
        await fsp.writeFile(path.join(workDir, "master.m3u8"), buildMasterPlaylist());

        await updateProgress(trackId, {
            status: "uploading_chunks",
            progress: 70,
            statusMessage: "Uploading HLS files",
        });

        await uploadDirectory(workDir + path.sep, basePath);

        const hls = {
            master: `${basePath}master.m3u8`,
            low: `${basePath}low.m3u8`,
            medium: `${basePath}medium.m3u8`,
            high: `${basePath}high.m3u8`,
            basePath,
        };

        await trackDao.updateStatus(trackId, {
            status: "ready",
            progress: 100,
            statusMessage: "Ready",
            hls,
        });
        emit(trackId, {
            status: "ready",
            progress: 100,
            statusMessage: "Ready",
            hls,
        });
    } catch (err) {
        console.error("[hls] processing failed:", err);
        // best-effort cleanup of partial S3 upload
        try {
            await deletePrefix(basePath);
        } catch {
            /* noop */
        }
        await trackDao.updateStatus(trackId, {
            status: "failed",
            statusMessage: err.message || "HLS processing failed",
        });
        emit(trackId, {
            status: "failed",
            progress: 0,
            statusMessage: err.message || "HLS processing failed",
        });
    } finally {
        try {
            await fsp.rm(workDir, { recursive: true, force: true });
        } catch {
            /* noop */
        }
    }
};
