import { randomUUID } from "crypto";
import path from "path";

import * as trackDao from "../track/track.dao.js";
import { getWriteUrl } from "../../lib/storage.js";
import { publicUrl } from "../../utils/media-url.util.js";
import { generateISRC } from "../../utils/isrc.util.js";
import { URL_TTL } from "../../constants.js";
import ApiError from "../../lib/api-error.js";
import { processSongHls } from "./hls.service.js";

/**
 * Step 1: presigned PUT URL for the raw audio file.
 */
export const createUploadUrl = async ({ fileName, contentType }, userId) => {
    if (!fileName || !contentType) {
        throw ApiError.badRequest("fileName and contentType are required");
    }
    const ext = path.extname(fileName) || ".mp3";
    const key = `audio/${userId}/${randomUUID()}${ext}`;
    const uploadUrl = await getWriteUrl(key, contentType, URL_TTL.FIVE_MINUTES);
    return { uploadUrl, key };
};

/**
 * Step 2: client confirms the raw upload finished. We persist a Track in
 * "processing" state and kick off the HLS pipeline in the background.
 */
export const confirmUpload = async (payload, userId) => {
    if (!payload.audioKey) throw ApiError.badRequest("audioKey is required");
    if (!payload.title) throw ApiError.badRequest("title is required");

    const audioUrl = publicUrl(payload.audioKey);
    const coverImage = payload.coverImageKey ? publicUrl(payload.coverImageKey) : null;

    const track = await trackDao.create({
        title: payload.title,
        audioUrl,
        audioFileId: payload.audioKey,
        duration: payload.duration || 0,
        primaryArtist: userId,
        artists: payload.artists?.length ? payload.artists : [userId],
        album: payload.album || null,
        genres: payload.genres || [],
        lang: payload.lang || null,
        isExplicit: Boolean(payload.isExplicit),
        copyrightOwner: payload.copyrightOwner || null,
        isrc: payload.isrc || generateISRC(),
        availableCountries: payload.availableCountries || [],
        coverImage,
        coverImageKey: payload.coverImageKey || null,
        status: "processing",
        progress: 0,
        statusMessage: "Queued",
    });

    // Fire-and-forget — never await. Errors are captured inside the pipeline.
    setImmediate(() => {
        console.log(`[song] kicking off HLS pipeline for ${track._id}`);
        processSongHls(String(track._id), payload.audioKey, userId).catch((err) => {
            console.error("[song] pipeline crashed:", err);
        });
    });

    return {
        id: String(track._id),
        status: track.status,
        progress: track.progress,
    };
};
