import asyncHandler from "../../lib/async-handler.js";
import response from "../../lib/api-response.js";
import ApiError from "../../lib/api-error.js";
import config from "../../config.js";
import * as songService from "./song.service.js";
import * as trackDao from "../track/track.dao.js";
import { subscribe, unsubscribe } from "./sse.js";
import { downloadObject, getReadUrl } from "../../lib/storage.js";

// Helper: consume an S3 readable stream into a string.
const streamToString = async (stream) => {
    const chunks = [];
    for await (const chunk of stream) {
        chunks.push(Buffer.from(chunk));
    }
    return Buffer.concat(chunks).toString("utf8");
};

export const getUploadUrl = asyncHandler(async (req, res) => {
    const data = await songService.createUploadUrl(req.body, req.user.id);
    return response.ok(res, { message: "Upload URL generated", ...data });
});

export const confirmUpload = asyncHandler(async (req, res) => {
    const data = await songService.confirmUpload(req.body, req.user.id);
    return response.created(res, {
        message: "Upload confirmed; processing started",
        data,
    });
});

/**
 * Plain JSON status — used as a polling fallback when SSE isn't available.
 * GET /songs/status/:songId
 */
export const getStatus = asyncHandler(async (req, res) => {
    const { songId } = req.params;
    const track = await trackDao.findById(songId, {
        select: "status progress statusMessage hls",
    });
    if (!track) {
        return response.ok(res, {
            message: "Not found",
            data: { status: "failed", progress: 0, statusMessage: "Not found" },
        });
    }
    return response.ok(res, {
        message: "OK",
        data: {
            songId,
            status: track.status,
            progress: track.progress,
            statusMessage: track.statusMessage,
            hls: track.hls,
        },
    });
});

/**
 * Server-Sent Events stream for processing progress.
 * GET /songs/progress/:songId
 */
export const progressStream = asyncHandler(async (req, res) => {
    const { songId } = req.params;

    res.set({
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
    });
    res.flushHeaders?.();

    // Send current DB state immediately so reconnecting clients see latest.
    const track = await trackDao.findById(songId, {
        select: "status progress statusMessage hls",
    });
    if (track) {
        res.write(
            `data: ${JSON.stringify({
                songId,
                status: track.status,
                progress: track.progress,
                statusMessage: track.statusMessage,
                hls: track.hls,
            })}\n\n`
        );
        // If already terminal, close connection.
        if (track.status === "ready" || track.status === "failed") {
            res.end();
            return;
        }
    }

    subscribe(songId, res);

    // Heartbeat to keep proxies from dropping the socket.
    const heartbeat = setInterval(() => {
        try {
            res.write(": ping\n\n");
        } catch {
            /* noop */
        }
    }, 25_000);

    req.on("close", () => {
        clearInterval(heartbeat);
        unsubscribe(songId, res);
    });
});

/**
 * Proxy the HLS master playlist, rewriting variant .m3u8 references
 * to use this API so they also go through the auth-aware proxy.
 * GET /songs/hls/:trackId/master.m3u8
 */
export const serveHlsMaster = asyncHandler(async (req, res) => {
    const { trackId } = req.params;
    const track = await trackDao.findById(trackId, { select: "hls status" });
    if (!track?.hls?.master) throw ApiError.notFound("HLS not ready for this track");

    const raw = await streamToString(await downloadObject(track.hls.master));

    // Rewrite "low.m3u8" / "medium.m3u8" / "high.m3u8" to backend proxy paths.
    const modified = raw.replace(
        /^(low|medium|high)\.m3u8$/gm,
        (match) => `${config.apiPrefix}/songs/hls/${trackId}/${match}`
    );

    res.set("Content-Type", "application/vnd.apple.mpegurl");
    res.set("Cache-Control", "no-cache");
    res.send(modified);
});

/**
 * Proxy a quality variant playlist, rewriting .ts segment lines
 * to short-lived presigned S3 URLs so they bypass CloudFront signing.
 * GET /songs/hls/:trackId/:quality.m3u8   (quality = low | medium | high)
 */
export const serveHlsVariant = asyncHandler(async (req, res) => {
    const { trackId, quality } = req.params;
    if (!/^(low|medium|high)$/.test(quality)) {
        throw ApiError.badRequest("Invalid quality — expected low, medium, or high");
    }

    const track = await trackDao.findById(trackId, { select: "hls status" });
    if (!track?.hls?.basePath) throw ApiError.notFound("HLS not ready for this track");

    const variantKey = `${track.hls.basePath}${quality}.m3u8`;
    const raw = await streamToString(await downloadObject(variantKey));

    // Replace each .ts filename with a 4-hour presigned S3 URL (direct to S3, no CF).
    const lines = raw.split("\n");
    const rewritten = [];
    for (const line of lines) {
        if (line.trim().endsWith(".ts")) {
            const segKey = `${track.hls.basePath}${line.trim()}`;
            rewritten.push(await getReadUrl(segKey, 4 * 3600));
        } else {
            rewritten.push(line);
        }
    }

    res.set("Content-Type", "application/vnd.apple.mpegurl");
    res.set("Cache-Control", "no-cache");
    res.send(rewritten.join("\n"));
});
