/**
 * Format duration (seconds) into "m:ss" — UI-friendly.
 */
export const formatDuration = (seconds = 0) => {
    const safe = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
    const minutes = Math.floor(safe / 60);
    const remain = safe % 60;
    return `${minutes}:${String(remain).padStart(2, "0")}`;
};

/**
 * Pagination helper — accepts query string-ish object, returns { page, limit, skip }.
 */
export const parsePagination = (query = {}, { defaultLimit = 10, maxLimit = 50 } = {}) => {
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.min(maxLimit, Math.max(1, parseInt(query.limit) || defaultLimit));
    return { page, limit, skip: (page - 1) * limit };
};
