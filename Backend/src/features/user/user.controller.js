import userService from "./user.service.js";
import asyncHandler from "../../lib/async-handler.js";
import response from "../../lib/api-response.js";

export const getProfile = asyncHandler(async (req, res) => {
    const data = await userService.getMyProfile(req.user.id);
    return response.ok(res, {
        message: "logged in user profile fetched successfully",
        ...data,
    });
});

export const updateProfile = asyncHandler(async (req, res) => {
    const user = await userService.updateMyProfile(req.user.id, req.body || {});
    return response.ok(res, { message: "Profile updated successfully", user });
});

export const getOtherUserProfile = asyncHandler(async (req, res) => {
    const data = await userService.getOtherUserProfile(req.params.id);
    return response.ok(res, {
        message: "user profile fetched successfully",
        ...data,
    });
});

export const getHistory = asyncHandler(async (req, res) =>
    response.ok(res, { message: "History endpoint not implemented", data: [] })
);

export const getRecentlyPlayed = asyncHandler(async (req, res) =>
    response.ok(res, { message: "Recently-played endpoint not implemented", data: [] })
);
