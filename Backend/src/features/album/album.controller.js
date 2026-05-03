import asyncHandler from "../../lib/async-handler.js";
import ApiError from "../../lib/api-error.js";

const notImplemented = asyncHandler(async () => {
    throw ApiError.notImplemented();
});

export const createAlbum = notImplemented;
export const getAlbum = notImplemented;
export const updateAlbum = notImplemented;
export const deleteAlbum = notImplemented;
export const getAlbumTracks = notImplemented;
export const getArtistAlbums = notImplemented;
