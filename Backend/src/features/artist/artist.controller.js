import asyncHandler from "../../lib/async-handler.js";
import ApiError from "../../lib/api-error.js";

const notImplemented = asyncHandler(async () => {
    throw ApiError.notImplemented();
});

export const getArtist = notImplemented;
export const getArtistTopTracks = notImplemented;
export const getArtistAlbums = notImplemented;
export const getArtistSingles = notImplemented;
export const getArtistAppearsOn = notImplemented;
export const getArtistFollowers = notImplemented;
export const getArtistAnalytics = notImplemented;
export const updateArtistProfile = notImplemented;
