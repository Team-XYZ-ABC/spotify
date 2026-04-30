import * as trackDao from "./track.dao.js";
import ApiError from "../../lib/api-error.js";
import { getReadUrl, deleteObject } from "../../lib/storage.js";
import { signObjectUrl, publicUrl } from "../../utils/media-url.util.js";
import { generateISRC } from "../../utils/isrc.util.js";
import { URL_TTL } from "../../constants.js";

const getTrack = async (trackId) => {
    if (!trackId) throw ApiError.badRequest("Track ID is required");
    const track = await trackDao.findWithArtistAndAlbum(trackId);
    if (!track) throw ApiError.notFound("Track not found");
    const data = track.toObject();
    data.coverImage = await signObjectUrl(data.coverImageKey, data.coverImage);
    return data;
};

const getStreamUrl = async (trackId) => {
    const track = await trackDao.findById(trackId, {
        select: "audioFileId audioUrl isPublished",
    });
    if (!track) throw ApiError.notFound("Track not found");
    if (track.audioFileId) {
        return getReadUrl(track.audioFileId, URL_TTL.ONE_HOUR);
    }
    return track.audioUrl;
};

const createTrack = async (payload, userId) => {
    if (!payload.audioKey) {
        throw ApiError.badRequest(
            "audioKey is required (upload the file first via /upload/presigned-url)"
        );
    }
    if (!payload.title) throw ApiError.badRequest("title is required");

    const audioUrl = publicUrl(payload.audioKey);
    const coverImage = payload.coverImageKey ? publicUrl(payload.coverImageKey) : null;

    return trackDao.create({
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
    });
};

const updateTrack = async (trackId, userId, body) => {
    const track = await trackDao.findById(trackId);
    if (!track) throw ApiError.notFound("Track not found");
    if (track.primaryArtist.toString() !== userId) {
        throw ApiError.forbidden("You can only update your own track");
    }

    const updates = {};
    if (body.title) updates.title = body.title;
    if (body.artists) updates.artists = body.artists;
    if (body.genres) updates.genres = body.genres;
    if (body.lang) updates.lang = body.lang;
    if (body.coverImageKey) {
        updates.coverImage = publicUrl(body.coverImageKey);
        updates.coverImageKey = body.coverImageKey;
    }
    return trackDao.updateById(trackId, updates);
};

const deleteTrack = async (trackId, userId) => {
    const track = await trackDao.findById(trackId);
    if (!track) throw ApiError.notFound("Track not found");
    if (track.primaryArtist.toString() !== userId) {
        throw ApiError.forbidden("You can delete only your own track");
    }
    if (track.audioFileId) {
        try {
            await deleteObject(track.audioFileId);
        } catch (err) {
            console.warn("[track] audio object delete failed:", err.message);
        }
    }
    await trackDao.deleteById(trackId);
};

const listMyTracks = async (artistId) => {
    const tracks = await trackDao.findByArtist(artistId);
    return Promise.all(
        tracks.map(async (track) => ({
            id: String(track._id),
            title: track.title,
            artists: track.artists || [],
            album: track.album || null,
            genres: track.genres || [],
            lang: track.lang || null,
            isExplicit: Boolean(track.isExplicit),
            copyrightOwner: track.copyrightOwner || null,
            isrc: track.isrc || null,
            availableCountries: track.availableCountries || [],
            durationSeconds: Number(track.duration) || 0,
            coverImage: await signObjectUrl(track.coverImageKey, track.coverImage),
            createdAt: track.createdAt,
            updatedAt: track.updatedAt,
        }))
    );
};

export default {
    getTrack,
    getStreamUrl,
    createTrack,
    updateTrack,
    deleteTrack,
    listMyTracks,
};
