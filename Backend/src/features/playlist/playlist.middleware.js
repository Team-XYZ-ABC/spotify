import playlistRepository from "./playlist.repository.js";
import ApiError from "../../core/http/api-error.js";

/**
 * Loads the playlist by ID and attaches it to `req.playlist`.
 */
export const loadPlaylist = async (req, res, next) => {
    try {
        const { playlistId } = req.params;
        if (!playlistId) throw ApiError.badRequest("Playlist ID is required");
        const playlist = await playlistRepository.findById(playlistId);
        if (!playlist) throw ApiError.notFound("Playlist not found");
        req.playlist = playlist;
        next();
    } catch (err) {
        next(err);
    }
};

/**
 * Owner-only guard.
 */
export const canManagePlaylist = (req, res, next) => {
    const userId = String(req.user?.id || "");
    const ownerId = String(req.playlist?.owner || "");
    if (userId !== ownerId) {
        return next(ApiError.forbidden("Only playlist owner can perform this action"));
    }
    next();
};

/**
 * Owner OR collaborator guard.
 */
export const canModifyPlaylistTracks = (req, res, next) => {
    const userId = String(req.user?.id || "");
    const ownerId = String(req.playlist?.owner || "");
    const collaboratorIds = (req.playlist?.collaborators || []).map((id) => String(id));
    if (!userId) return next(ApiError.unauthorized());
    if (userId === ownerId || collaboratorIds.includes(userId)) return next();
    next(ApiError.forbidden("Only owner or collaborators can modify playlist tracks"));
};
