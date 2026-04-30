import asyncHandler from "../../core/http/async-handler.js";
import playerService from "./player.service.js";

export const getCurrentPlayback = asyncHandler(() => playerService.getCurrentPlayback());
export const playTrack = asyncHandler(() => playerService.playTrack());
export const pauseTrack = asyncHandler(() => playerService.pauseTrack());
export const nextTrack = asyncHandler(() => playerService.nextTrack());
export const previousTrack = asyncHandler(() => playerService.previousTrack());
export const addToQueue = asyncHandler(() => playerService.addToQueue());
export const getQueue = asyncHandler(() => playerService.getQueue());
