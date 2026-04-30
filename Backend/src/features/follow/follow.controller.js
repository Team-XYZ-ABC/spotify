import asyncHandler from "../../lib/async-handler.js";
import ApiError from "../../lib/api-error.js";

const notImplemented = asyncHandler(async () => {
    throw ApiError.notImplemented();
});

export const followArtist = notImplemented;
export const unfollowArtist = notImplemented;
export const getArtistFollowers = notImplemented;
