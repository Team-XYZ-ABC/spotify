import api from "@/shared/config/axios.config";

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
 * HLS pipeline — get an upload URL specifically for an audio source file.
 * The backend will later kick off FFmpeg HLS processing.
 */
export const getSongUploadUrlService = async (payload) => {
    try {
        const res = await api.post("/songs/upload-url", payload);
        return res.data; // { uploadUrl, key }
    } catch (error) {
        throw error.response?.data || { message: "Failed to get song upload URL" };
    }
};

/**
 * Upload a file directly to S3 via presigned URL.
 * Optional onProgress(percent) callback uses XHR for real progress events.
 */
export const uploadToS3Service = (uploadUrl, file, onProgress) =>
    new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", uploadUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable && typeof onProgress === "function") {
                onProgress(Math.round((e.loaded / e.total) * 100));
            }
        };
        xhr.onload = () =>
            xhr.status >= 200 && xhr.status < 300
                ? resolve()
                : reject(new Error(`S3 upload failed (HTTP ${xhr.status})`));
        xhr.onerror = () => reject(new Error("S3 upload network error"));
        xhr.send(file);
    });

/**
 * Confirm raw audio upload finished — creates a Track row in "processing"
 * state and triggers FFmpeg/HLS pipeline server-side.
 */
export const confirmSongUploadService = async (payload) => {
    try {
        const res = await api.post("/songs/confirm-upload", payload);
        return res.data; // { data: { id, status, progress } }
    } catch (error) {
        throw error.response?.data || { message: "Failed to confirm upload" };
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