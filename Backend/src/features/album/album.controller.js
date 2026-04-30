import asyncHandler from "../../core/http/async-handler.js";
import albumService from "./album.service.js";

export const createAlbum = asyncHandler(async () => albumService.createAlbum());
export const getAlbum = asyncHandler(async () => albumService.getAlbum());
export const updateAlbum = asyncHandler(async () => albumService.updateAlbum());
export const deleteAlbum = asyncHandler(async () => albumService.deleteAlbum());
export const getAlbumTracks = asyncHandler(async () => albumService.getAlbumTracks());
export const getArtistAlbums = asyncHandler(async () => albumService.getArtistAlbums());
