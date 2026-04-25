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
  getMyTracks
} from "../controllers/track.controller.js";
import isAuthenticated from "../middlewares/auth.middleware.js";
import authRole from "../middlewares/authRole.middleware.js";

const trackRouter = Router();

trackRouter.get("/:trackId", getTrack);

trackRouter.get("/:trackId/stream", streamTrack);

trackRouter.post("/:trackId/like", likeTrack);

trackRouter.delete("/:trackId/like", unlikeTrack);

trackRouter.get("/:trackId/lyrics", getTrackLyrics);

trackRouter.get("/:trackId/credits", getTrackCredits);

trackRouter.get("/:trackId/recommendations", getTrackRecommendations);

trackRouter.post("/artist/upload/track", isAuthenticated, authRole(["artist"]), uploadTrack);

trackRouter.get("/artist/my-tracks", isAuthenticated, authRole(["artist"]), getMyTracks);

trackRouter.patch("/artist/:trackId", isAuthenticated, authRole(["artist"]), updateTrack);

trackRouter.delete("/artist/:trackId", isAuthenticated, authRole(["artist"]), deleteTrack);

export default trackRouter;