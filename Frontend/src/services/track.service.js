import api from "../configs/axios.config";

export const uploadTrackService = async (formData) => {
    try {
        const res = await api.post("/tracks/artist/upload/track",formData);

        return res.data;

    } catch (error) {
        throw error.response?.data || {
            message: "Something went wrong"
        };
    }
};


export const getTrackService = async (id) => {
    try {
        const res = await api.get(`/tracks/${id}`);

        return res.data;

    } catch (error) {
        throw error.response?.data || {
            message: "Something went wrong"
        };
    }
};


export const updateTrackService = async (id,data) => {
    try {
        const res = await api.patch(`/tracks/artist/${id}`, data);

        return res.data;

    } catch (error) {
        throw error.response?.data || {
            message: "Something went wrong"
        };
    }
};


export const deleteTrackService = async (id) => {
    try {
        const res = await api.delete(`/tracks/artist/${id}`);

        return res.data;

    } catch (error) {
        throw error.response?.data || {
            message: "Something went wrong"
        };
    }
};