import asyncHandler from "../../core/http/async-handler.js";
import libraryService from "./library.service.js";

export const getLikedTracks = asyncHandler(() => libraryService.getLikedTracks());
export const likeTrack = asyncHandler(() => libraryService.likeTrack());
export const unlikeTrack = asyncHandler(() => libraryService.unlikeTrack());
