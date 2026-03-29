import api from "../configs/axios.config";

export const registerService = async (user) => {
    try {
        const res = await api.post("/auth/register", user);

        return res.data;

    } catch (error) {
        throw error.response?.data || {
            message: "Something went wrong"
        };
    }
};

export const loginService = async (data) => {
    try {
        const res = await api.post("/auth/login", data);
        return res.data;
    } catch (error) {
        throw error.response?.data || {
            message: "Something went wrong"
        };
    }
};
