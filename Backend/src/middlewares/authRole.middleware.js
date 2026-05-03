import ApiError from "../lib/api-error.js";

const authRole = (roles = []) => (req, res, next) => {
    if (!req.user) return next(ApiError.unauthorized("Unauthorized - User not logged in"));
    if (!roles.includes(req.user.role)) {
        return next(ApiError.forbidden("Forbidden - You don't have permission"));
    }
    next();
};

export default authRole;
