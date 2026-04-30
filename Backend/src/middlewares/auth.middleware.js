import { jwtVerify } from "../utils/jwt.util.js";
import config from "../config/index.js";
import ApiError from "../core/http/api-error.js";

/**
 * Require a valid auth cookie. Attaches `req.user = { id, role }`.
 */
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

/**
 * Optional auth — attaches `req.user` if a valid token is present
 * but never rejects the request.
 */
export const optionalAuth = (req, res, next) => {
    try {
        const token = req.cookies?.[config.auth.cookieName];
        if (token) req.user = jwtVerify(token);
    } catch {
        // ignore — keep req.user undefined
    }
    next();
};

export default isAuthenticated;
