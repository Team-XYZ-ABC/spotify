import { Router } from "express";
import {
    getTrack,
    streamTrack,
    likeTrack,
    unlikeTrack,
    getTrackLyrics,
    getTrackCredits,
    getTrackRecommendations,
    updateTrack,
    deleteTrack,
    uploadTrack,
    getMyTracks,
} from "./track.controller.js";
import isAuthenticated from "../../middlewares/auth.middleware.js";
import authRole from "../../middlewares/authRole.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { updateTrackSchema, uploadTrackSchema } from "./track.validation.js";
import { ROLES } from "../../core/constants/index.js";

const router = Router();

// Artist routes — registered BEFORE the dynamic :trackId routes
router.post(
    "/artist/upload/track",
    isAuthenticated,
    authRole([ROLES.ARTIST]),
    validate(uploadTrackSchema),
    uploadTrack
);
router.get(
    "/artist/my-tracks",
    isAuthenticated,
    authRole([ROLES.ARTIST]),
    getMyTracks
);
router.patch(
    "/artist/:trackId",
    isAuthenticated,
    authRole([ROLES.ARTIST]),
    validate(updateTrackSchema),
    updateTrack
);
router.delete(
    "/artist/:trackId",
    isAuthenticated,
    authRole([ROLES.ARTIST]),
    deleteTrack
);

// Public + listener routes
router.get("/:trackId", getTrack);
router.get("/:trackId/stream", streamTrack);
router.post("/:trackId/like", likeTrack);
router.delete("/:trackId/like", unlikeTrack);
router.get("/:trackId/lyrics", getTrackLyrics);
router.get("/:trackId/credits", getTrackCredits);
router.get("/:trackId/recommendations", getTrackRecommendations);

export default router;
