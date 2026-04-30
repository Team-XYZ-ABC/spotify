import asyncHandler from "../../core/http/async-handler.js";
import artistService from "./artist.service.js";

export const getArtist = asyncHandler(() => artistService.getArtist());
export const getArtistTopTracks = asyncHandler(() => artistService.getArtistTopTracks());
export const getArtistAlbums = asyncHandler(() => artistService.getArtistAlbums());
export const getArtistSingles = asyncHandler(() => artistService.getArtistSingles());
export const getArtistAppearsOn = asyncHandler(() => artistService.getArtistAppearsOn());
export const getArtistFollowers = asyncHandler(() => artistService.getArtistFollowers());
export const getArtistAnalytics = asyncHandler(() => artistService.getArtistAnalytics());
export const updateArtistProfile = asyncHandler(() => artistService.updateArtistProfile());
