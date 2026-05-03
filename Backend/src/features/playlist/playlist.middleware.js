import * as playlistDao from "./playlist.dao.js";
import ApiError from "../../lib/api-error.js";

export const loadPlaylist = async (req, res, next) => {
    try {
        const { playlistId } = req.params;
        if (!playlistId) throw ApiError.badRequest("Playlist ID is required");
        const playlist = await playlistDao.findById(playlistId);
        if (!playlist) throw ApiError.notFound("Playlist not found");
        req.playlist = playlist;
        next();
    } catch (err) {
        next(err);
    }
};

export const canManagePlaylist = (req, res, next) => {
    const userId = String(req.user?.id || "");
    const ownerId = String(req.playlist?.owner || "");
    if (userId !== ownerId) {
        return next(ApiError.forbidden("Only playlist owner can perform this action"));
    }
    next();
};

export const canModifyPlaylistTracks = (req, res, next) => {
    const userId = String(req.user?.id || "");
    const ownerId = String(req.playlist?.owner || "");
    const collaboratorIds = (req.playlist?.collaborators || []).map((id) => String(id));
    if (!userId) return next(ApiError.unauthorized());
    if (userId === ownerId || collaboratorIds.includes(userId)) return next();
    next(ApiError.forbidden("Only owner or collaborators can modify playlist tracks"));
};
