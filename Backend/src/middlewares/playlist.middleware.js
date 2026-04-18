import PlaylistModel from "../models/playlist.model.js";

/**
 * Middleware to load playlist by ID
 * Attaches playlist to req object if found
 */
export const loadPlaylist = async (req, res, next) => {
    try {
        const { playlistId } = req.params;

        if (!playlistId) {
            return res.status(400).json({
                message: "Playlist ID is required",
            });
        }

        const playlist = await PlaylistModel.findById(playlistId);

        if (!playlist) {
            return res.status(404).json({
                message: "Playlist not found",
            });
        }

        req.playlist = playlist;
        next();
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Server error",
        });
    }
};


/**
 * Middleware to ensure only the playlist owner can perform the action
 */
export const canManagePlaylist = (req, res, next) => {
    const userId = String(req.user?.id || "");
    const ownerId = String(req.playlist?.owner || "");

    if (userId !== ownerId) {
        return res.status(403).json({
            message: "Only playlist owner can perform this action",
        });
    }

    next();
};


/**
 * Middleware to allow playlist track modifications
 * Access: Owner or collaborators
 */
export const canModifyPlaylistTracks = (req, res, next) => {
    const userId = String(req.user?.id || "");
    const ownerId = String(req.playlist?.owner || "");
    const collaboratorIds = (req.playlist?.collaborators || []).map((id) => String(id));

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (userId === ownerId || collaboratorIds.includes(userId)) {
        return next();
    }

    return res.status(403).json({
        message: "Only owner or collaborators can modify playlist tracks",
    });
};
