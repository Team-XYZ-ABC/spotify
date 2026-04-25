import api from "../configs/axios.config";

/**
 * Get a presigned S3 PUT URL from the backend.
 * @param {{ fileName: string, contentType: string, folder: string }} payload
 */
export const getUploadUrlService = async (payload) => {
    const res = await api.post("/upload/presigned-url", payload);
    return res.data; // { uploadUrl, key }
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
        throw new Error(`S3 upload failed (HTTP ${res.status})`);
    }
};
