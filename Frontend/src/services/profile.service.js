import api from "../configs/axios.config";

export const getProfileService = async () => {
    try {
        const res = await api.get("/users/my-profile");

        return res.data;

    } catch (error) {
        throw error.response?.data || {
            message: "Something went wrong"
        };
    }
};

export const updateProfileService = async (data) => {
    try {
        const res = await api.patch("/users/my-profile",data);

        return res.data;

    } catch (error) {
        throw error.response?.data || {
            message: "Something went wrong"
        };
    }
};

export const otherUserPofileService = async (id) => {
    try {
        const res = await api.get(`/users/${id}`);

        return res.data;

    } catch (error) {
        throw error.response?.data || {
            message: "Something went wrong"
        };
    }
};
