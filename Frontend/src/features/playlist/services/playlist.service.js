import api from "@/shared/config/axios.config";

const normalizeError = (error, fallbackMessage) => {
    throw (
        error?.response?.data || {
            message: error?.message || fallbackMessage,
        }
    );
};

export const getMyPlaylistsService = async () => {
    try {
        const res = await api.get("/playlists/me/playlists");
        return res.data;
    } catch (error) {
        normalizeError(error, "Failed to load playlists");
    }
};

export const getPlaylistByIdService = async (playlistId) => {
    try {
        const res = await api.get(`/playlists/${playlistId}`);
        return res.data;
    } catch (error) {
        normalizeError(error, "Failed to load playlist");
    }
};

export const createPlaylistService = async (payload) => {
    try {
        const res = await api.post("/playlists", payload);
        return res.data;
    } catch (error) {
        normalizeError(error, "Failed to create playlist");
    }
};

export const updatePlaylistService = async (playlistId, payload) => {
    try {
        const res = await api.patch(`/playlists/${playlistId}`, payload);
        return res.data;
    } catch (error) {
        normalizeError(error, "Failed to update playlist");
    }
};

export const deletePlaylistService = async (playlistId) => {
    try {
        const res = await api.delete(`/playlists/${playlistId}`);
        return res.data;
    } catch (error) {
        normalizeError(error, "Failed to delete playlist");
    }
};

export const addCollaboratorsService = async (playlistId, collaboratorIds) => {
    try {
        const res = await api.post(`/playlists/${playlistId}/collaborators`, {
            collaboratorIds,
        });
        return res.data;
    } catch (error) {
        normalizeError(error, "Failed to add collaborators");
    }
};

export const removeCollaboratorService = async (playlistId, userId) => {
    try {
        const res = await api.delete(`/playlists/${playlistId}/collaborators/${userId}`);
        return res.data;
    } catch (error) {
        normalizeError(error, "Failed to remove collaborator");
    }
};

export const searchCollaboratorsService = async (query) => {
    try {
        const res = await api.get("/playlists/users/search", {
            params: { q: query },
        });
        return res.data;
    } catch (error) {
        normalizeError(error, "Failed to search users");
    }
};

export const searchTracksService = async (query, excludePlaylistId) => {
    try {
        const res = await api.get("/playlists/tracks/search", {
            params: {
                q: query,
                excludePlaylistId,
            },
        });
        return res.data;
    } catch (error) {
        normalizeError(error, "Failed to search tracks");
    }
};

export const addTrackService = async (playlistId, trackId) => {
    try {
        const res = await api.post(`/playlists/${playlistId}/tracks`, { trackId });
        return res.data;
    } catch (error) {
        normalizeError(error, "Failed to add track");
    }
};

export const removeTrackService = async (playlistId, trackId) => {
    try {
        const res = await api.delete(`/playlists/${playlistId}/tracks/${trackId}`);
        return res.data;
    } catch (error) {
        normalizeError(error, "Failed to remove track");
    }
};

export const reorderTracksService = async (playlistId, sourceIndex, destinationIndex) => {
    try {
        const res = await api.patch(`/playlists/${playlistId}/tracks/reorder`, {
            sourceIndex,
            destinationIndex,
        });
        return res.data;
    } catch (error) {
        normalizeError(error, "Failed to reorder tracks");
    }
};
