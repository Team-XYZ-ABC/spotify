import { ZodError } from "zod";
import ApiError from "./api-error.js";
import logger from "../logger/logger.js";
import { ERROR_CODES, HTTP_STATUS } from "../constants/index.js";
import config from "../../config/index.js";

const log = logger.child("error-handler");

// 404 fallback — placed AFTER all routes
export const notFoundHandler = (req, res, next) => {
    next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
};

// Global error middleware — must have 4 args
// eslint-disable-next-line no-unused-vars
export const globalErrorHandler = (err, req, res, next) => {
    // Zod validation
    if (err instanceof ZodError) {
        const issues = err.issues ?? err.errors ?? [];
        const details = issues.map((e) => ({ field: e.path.join("."), message: e.message }));
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            message: "Validation failed",
            code: ERROR_CODES.VALIDATION,
            errors: details,
        });
    }

    // Mongoose CastError → 400 (bad id)
    if (err?.name === "CastError") {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            message: `Invalid ${err.path}`,
            code: ERROR_CODES.VALIDATION,
        });
    }

    // Mongoose duplicate key
    if (err?.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || "field";
        return res.status(HTTP_STATUS.CONFLICT).json({
            success: false,
            message: `${field} already exists`,
            code: ERROR_CODES.CONFLICT,
        });
    }

    // Known operational error
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            code: err.code,
            ...(err.details && { details: err.details }),
        });
    }

    // Unknown error → 500
    log.error(err.message || "Unhandled error", { stack: err.stack });
    return res.status(HTTP_STATUS.INTERNAL).json({
        success: false,
        message: config.app.nodeEnv === "production" ? "Internal server error" : err.message,
        code: ERROR_CODES.INTERNAL,
        ...(config.app.nodeEnv !== "production" && { stack: err.stack }),
    });
};
