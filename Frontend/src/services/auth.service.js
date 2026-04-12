import api from "../configs/axios.config";


const handleError = (error, fallbackMessage) => {
    const message =
        error?.response?.data?.message ||
        error?.message ||
        fallbackMessage;

    throw new Error(message);
};

export const checkEmailExistService = async (email) => {
    try {
        const res = await api.post("/auth/email-exists", { email });
        return res.data;
    } catch (error) {
        handleError(error, "Failed to check email");
    }
};

export const registerService = async (user) => {
    try {
        const res = await api.post("/auth/register", user);
        return res.data;
    } catch (error) {
        handleError(error, "Registration failed");
    }
};

export const loginService = async (data) => {
    try {
        const res = await api.post("/auth/login", data);
        return res.data;
    } catch (error) {
        handleError(error, "Login failed");
    }
};

export const logoutService = async () => {
    try {
        const res = await api.post("/auth/logout");
        return res.data;
    } catch (error) {
        handleError(error, "Logout failed");
    }
};

export const getMeService = async () => {
    try {
        const res = await api.get("/auth/me");
        return res.data;
    } catch (error) {
        handleError(error, "Failed to fetch user");
    }
};