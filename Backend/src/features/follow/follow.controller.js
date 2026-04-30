import asyncHandler from "../../core/http/async-handler.js";
import followService from "./follow.service.js";

export const followArtist = asyncHandler(() => followService.followArtist());
export const unfollowArtist = asyncHandler(() => followService.unfollowArtist());
export const getArtistFollowers = asyncHandler(() =>
    followService.getArtistFollowers()
);
