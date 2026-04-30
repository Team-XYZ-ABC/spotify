import authService from "./auth.service.js";
import asyncHandler from "../../core/http/async-handler.js";
import response from "../../core/http/api-response.js";
import config from "../../config/index.js";
import { authCookieOptions, authCookieClearOptions } from "../../utils/cookie.util.js";
import { jwtVerify } from "../../utils/jwt.util.js";
import ApiError from "../../core/http/api-error.js";

export const isEmailExist = asyncHandler(async (req, res) => {
    const exists = await authService.emailExists(req.body.email);
    return response.ok(res, { exists, message: "OK" });
});

export const registerUser = asyncHandler(async (req, res) => {
    const { token, user } = await authService.register(req.body);
    res.cookie(config.auth.cookieName, token, authCookieOptions());
    return response.created(res, { message: "User registered successfully", user });
});

export const loginUser = asyncHandler(async (req, res) => {
    const { token, user } = await authService.login(req.body);
    res.cookie(config.auth.cookieName, token, authCookieOptions());
    return response.ok(res, { message: "User logged in successfully", user });
});

export const logoutUser = asyncHandler(async (req, res) => {
    const token = req.cookies?.[config.auth.cookieName];
    if (!token) throw ApiError.unauthorized();
    res.clearCookie(config.auth.cookieName, authCookieClearOptions());
    return response.ok(res, { message: "User logged out successfully" });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
    const token = req.cookies?.[config.auth.cookieName];
    if (!token) throw ApiError.unauthorized();
    let decoded;
    try {
        decoded = jwtVerify(token);
    } catch {
        throw ApiError.unauthorized("Invalid or expired token");
    }
    const user = await authService.getCurrentUser(decoded.id);
    return response.ok(res, { message: "logged in user fetched successfully", user });
});
