import { jwtVerify } from "../utils/jwt.util.js";
import config from "../config.js";
import ApiError from "../lib/api-error.js";

const isAuthenticated = (req, res, next) => {
    try {
        const token = req.cookies?.[config.auth.cookieName];
        if (!token) throw ApiError.unauthorized("Unauthorized - Please login!");
        req.user = jwtVerify(token);
        next();
    } catch (err) {
        if (err instanceof ApiError) return next(err);
        next(ApiError.unauthorized("Unauthorized"));
    }
};

export const optionalAuth = (req, res, next) => {
    try {
        const token = req.cookies?.[config.auth.cookieName];
        if (token) req.user = jwtVerify(token);
    } catch {
        // ignore
    }
    next();
};

export default isAuthenticated;
