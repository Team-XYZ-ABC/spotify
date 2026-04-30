import asyncHandler from "../../lib/async-handler.js";
import ApiError from "../../lib/api-error.js";

const notImplemented = asyncHandler(async () => {
    throw ApiError.notImplemented();
});

export const getLikedTracks = notImplemented;
export const likeTrack = notImplemented;
export const unlikeTrack = notImplemented;
