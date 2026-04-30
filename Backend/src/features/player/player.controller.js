import asyncHandler from "../../lib/async-handler.js";
import ApiError from "../../lib/api-error.js";

const notImplemented = asyncHandler(async () => {
    throw ApiError.notImplemented();
});

export const getCurrentPlayback = notImplemented;
export const playTrack = notImplemented;
export const pauseTrack = notImplemented;
export const nextTrack = notImplemented;
export const previousTrack = notImplemented;
export const addToQueue = notImplemented;
export const getQueue = notImplemented;
