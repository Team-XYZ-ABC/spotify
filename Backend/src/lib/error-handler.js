import { ZodError } from "zod";
import ApiError from "./api-error.js";
import { ERROR_CODES, HTTP_STATUS } from "../constants.js";
import config from "../config.js";

export const notFoundHandler = (req, res, next) => {
    next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
};

// eslint-disable-next-line no-unused-vars
export const globalErrorHandler = (err, req, res, next) => {
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

    if (err?.name === "CastError") {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            message: `Invalid ${err.path}`,
            code: ERROR_CODES.VALIDATION,
        });
    }

    if (err?.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || "field";
        return res.status(HTTP_STATUS.CONFLICT).json({
            success: false,
            message: `${field} already exists`,
            code: ERROR_CODES.CONFLICT,
        });
    }

    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            code: err.code,
            ...(err.details && { details: err.details }),
        });
    }

    console.error("[error]", err.message, err.stack);
    return res.status(HTTP_STATUS.INTERNAL).json({
        success: false,
        message: config.nodeEnv === "production" ? "Internal server error" : err.message,
        code: ERROR_CODES.INTERNAL,
        ...(config.nodeEnv !== "production" && { stack: err.stack }),
    });
};
