import { ERROR_CODES, HTTP_STATUS } from "../constants/index.js";

/**
 * Standard application error class.
 *
 * Throw this from services/repositories instead of res.status().
 * The global error handler converts it to a uniform HTTP response.
 */
export default class ApiError extends Error {
    constructor(statusCode, message, code = ERROR_CODES.INTERNAL, details = null) {
        super(message);
        this.name = "ApiError";
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
        this.isOperational = true;
        Error.captureStackTrace?.(this, this.constructor);
    }

    static badRequest(msg = "Bad request", details = null) {
        return new ApiError(HTTP_STATUS.BAD_REQUEST, msg, ERROR_CODES.VALIDATION, details);
    }
    static unauthorized(msg = "Unauthorized") {
        return new ApiError(HTTP_STATUS.UNAUTHORIZED, msg, ERROR_CODES.UNAUTHORIZED);
    }
    static forbidden(msg = "Forbidden") {
        return new ApiError(HTTP_STATUS.FORBIDDEN, msg, ERROR_CODES.FORBIDDEN);
    }
    static notFound(msg = "Not found") {
        return new ApiError(HTTP_STATUS.NOT_FOUND, msg, ERROR_CODES.NOT_FOUND);
    }
    static conflict(msg = "Conflict") {
        return new ApiError(HTTP_STATUS.CONFLICT, msg, ERROR_CODES.CONFLICT);
    }
    static internal(msg = "Internal server error") {
        return new ApiError(HTTP_STATUS.INTERNAL, msg, ERROR_CODES.INTERNAL);
    }
    static notImplemented(msg = "Not implemented") {
        return new ApiError(HTTP_STATUS.NOT_IMPLEMENTED, msg, ERROR_CODES.NOT_IMPLEMENTED);
    }
}
