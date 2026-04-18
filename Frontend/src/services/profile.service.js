import api from "../configs/axios.config";

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