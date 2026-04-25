import api from "../configs/axios.config";

/**
 * Get a presigned S3 PUT URL for avatar upload.
 */
export const getAvatarUploadUrlService = async (fileName, contentType) => {
    const res = await api.post("/upload/presigned-url", {
        fileName,
        contentType,
        folder: "profiles",
    });
    return res.data; // { uploadUrl, key }
};

/**
 * Upload avatar file directly to S3 via presigned URL.
 * Uses native fetch — must NOT send auth cookies/headers to S3.
 */
export const uploadAvatarToS3 = async (uploadUrl, file) => {
    const res = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
    });
    if (!res.ok) {
        throw new Error(`S3 upload failed (HTTP ${res.status})`);
    }
};

/**
 * Fetch logged-in user's profile
 */
export const getProfileService = async () => {
    try {
        const res = await api.get("/users/my-profile");
        return res.data;
    } catch (error) {
        throw error.response?.data || {
            message: "Something went wrong",
        };
    }
};

/**
 * Update user profile (name / avatar)
 */
export const updateProfileService = async (data) => {
    try {
        const res = await api.patch("/users/my-profile", data);
        return res.data;
    } catch (error) {
        throw error.response?.data || {
            message: "Something went wrong",
        };
    }
};

/**
 * Fetch another user's profile by ID
 */
export const otherUserProfileService = async (id) => {
    try {
        const res = await api.get(`/users/${id}`);
        return res.data;
    } catch (error) {
        throw error.response?.data || {
            message: "Something went wrong",
        };
    }
};