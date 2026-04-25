import api from "../configs/axios.config";

// ---------- S3 UPLOAD ----------

/**
 * Get a presigned S3 PUT URL from the backend.
 * @param {{ fileName: string, contentType: string, folder: string }} payload
 */
export const getUploadUrlService = async (payload) => {
    try {
        const res = await api.post("/upload/presigned-url", payload);
        return res.data; // { uploadUrl, key }
    } catch (error) {
        throw error.response?.data || { message: "Failed to get upload URL" };
    }
};

/**
 * Upload a file directly to S3 via presigned URL.
 * Uses native fetch — must NOT send auth cookies/headers to S3.
 */
export const uploadToS3Service = async (uploadUrl, file) => {
    const res = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
    });
    if (!res.ok) {
        throw { message: `S3 upload failed (HTTP ${res.status})` };
    }
};

// ---------- TRACK ----------

export const uploadTrackService = async (data) => {
    try {
        const res = await api.post("/tracks/artist/upload/track", data);
        return res.data;
    } catch (error) {
        throw error.response?.data || {
            message: "Something went wrong while uploading track",
        };
    }
};

export const getTrackService = async (id) => {
    try {
        const res = await api.get(`/tracks/${id}`);
        return res.data;
    } catch (error) {
        throw error.response?.data || {
            message: "Failed to fetch track",
        };
    }
};

export const getMyTracksService = async () => {
    try {
        const res = await api.get("/tracks/artist/my-tracks");
        return res.data;
    } catch (error) {
        throw error.response?.data || {
            message: "Failed to fetch your tracks",
        };
    }
};

export const updateTrackService = async (id, data) => {
    try {
        const res = await api.patch(`/tracks/artist/${id}`, data);
        return res.data;
    } catch (error) {
        throw error.response?.data || {
            message: "Failed to update track",
        };
    }
};

export const deleteTrackService = async (id) => {
    try {
        const res = await api.delete(`/tracks/artist/${id}`);
        return res.data;
    } catch (error) {
        throw error.response?.data || {
            message: "Failed to delete track",
        };
    }
};

/**
 * Get a short-lived presigned S3 stream URL for a track.
 * Must be called right before playback — URL expires in 1 hour.
 */
export const getStreamUrlService = async (trackId) => {
    try {
        const res = await api.get(`/tracks/${trackId}/stream`);
        return res.data; // { streamUrl }
    } catch (error) {
        throw error.response?.data || {
            message: "Failed to get stream URL",
        };
    }
};