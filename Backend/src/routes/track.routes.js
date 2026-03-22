import { Router } from "express";
import {
  getTrack,
  streamTrack,
  likeTrack,
  unlikeTrack,
  getTrackLyrics,
  getTrackCredits,
  getTrackRecommendations,
  uploadTrack,
  updateTrack,
  deleteTrack
} from "../controllers/track.controller.js";
import authRole from "../middlewares/authRole.middleware.js";
import isAuthenticated from "../middlewares/auth.middleware.js";

const trackRouter = Router();

trackRouter.get("/:trackId", getTrack);

trackRouter.get("/:trackId/stream", streamTrack);

trackRouter.post("/:trackId/like", likeTrack);

trackRouter.delete("/:trackId/like", unlikeTrack);

trackRouter.get("/:trackId/lyrics", getTrackLyrics);

trackRouter.get("/:trackId/credits", getTrackCredits);

trackRouter.get("/:trackId/recommendations", getTrackRecommendations);

trackRouter.post("/artist/upload",isAuthenticated, authRole(['artist']), uploadTrack);

trackRouter.patch("/artist/:trackId", updateTrack);

trackRouter.delete("/artist/:trackId", deleteTrack);

export default trackRouter;