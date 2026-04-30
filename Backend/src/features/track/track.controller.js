import trackService from "./track.service.js";
import asyncHandler from "../../core/http/async-handler.js";
import response from "../../core/http/api-response.js";

export const getTrack = asyncHandler(async (req, res) => {
    const data = await trackService.getTrack(req.params.trackId);
    return response.ok(res, { message: "Track fetched successfully", data });
});

export const streamTrack = asyncHandler(async (req, res) => {
    const streamUrl = await trackService.getStreamUrl(req.params.trackId);
    return res.status(200).json({ streamUrl });
});

export const uploadTrack = asyncHandler(async (req, res) => {
    const data = await trackService.createTrack(req.body, req.user.id);
    return response.created(res, { message: "Track uploaded successfully", data });
});

export const updateTrack = asyncHandler(async (req, res) => {
    const data = await trackService.updateTrack(req.params.trackId, req.user.id, req.body);
    return response.ok(res, { message: "Track updated successfully", data });
});

export const deleteTrack = asyncHandler(async (req, res) => {
    await trackService.deleteTrack(req.params.trackId, req.user.id);
    return response.ok(res, { message: "Track deleted successfully" });
});

export const getMyTracks = asyncHandler(async (req, res) => {
    const data = await trackService.listMyTracks(req.user.id);
    return response.ok(res, { message: "Tracks fetched successfully", data });
});

// ── Reserved endpoints (not yet implemented) ─────────────────────────────────
const stub = (label) =>
    asyncHandler(async (req, res) =>
        response.ok(res, { message: `${label} endpoint not implemented` })
    );

export const likeTrack = stub("Like track");
export const unlikeTrack = stub("Unlike track");
export const getTrackLyrics = stub("Track lyrics");
export const getTrackCredits = stub("Track credits");
export const getTrackRecommendations = stub("Track recommendations");
