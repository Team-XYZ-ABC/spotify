export const sanitizeInput = (value) => {
    if (typeof value !== "string") return value;
    return value.trim().replace(/\s+/g, " ")
};