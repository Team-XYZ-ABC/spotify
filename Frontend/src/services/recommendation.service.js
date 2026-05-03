import api from "../configs/axios.config";

const BASE = "/recommendations";

/**
 * @param {"recommended"|"popular"|"episodes"|"featured-charts"} section
 * @param {number} page
 * @param {number} limit
 * @param {object} [extra]  extra query params (e.g. { genre: "Pop" })
 */
export const fetchRecommendationSection = async (section, page = 1, limit = 10, extra = {}) => {
    const params = new URLSearchParams({ page, limit, ...extra }).toString();
    const res = await api.get(`${BASE}/${section}?${params}`);
    return res.data; // { success, data, pagination }
};

export const fetchRecommended = (page, limit) =>
    fetchRecommendationSection("recommended", page, limit);

export const fetchPopular = (page, limit) =>
    fetchRecommendationSection("popular", page, limit);

export const fetchEpisodes = (page, limit) =>
    fetchRecommendationSection("episodes", page, limit);

export const fetchFeaturedCharts = (page, limit, genre) =>
    fetchRecommendationSection("featured-charts", page, limit, genre ? { genre } : {});
