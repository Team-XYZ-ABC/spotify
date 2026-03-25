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
  uploadTrack
} from "../controllers/track.controller.js";
<<<<<<< HEAD
import authRole from "../middlewares/authRole.middleware.js";
import isAuthenticated from "../middlewares/auth.middleware.js";
=======
import upload from "../middlewares/multer.js";
import isAuthenticated from "../middlewares/auth.middleware.js";
import authRole from "../middlewares/authRole.middleware.js";
>>>>>>> 967bb96ae190ea6b05c30c1ac3d933d948559c81

const trackRouter = Router();

trackRouter.get("/:trackId", getTrack);

trackRouter.get("/:trackId/stream", streamTrack);

trackRouter.post("/:trackId/like", likeTrack);

trackRouter.delete("/:trackId/like", unlikeTrack);

trackRouter.get("/:trackId/lyrics", getTrackLyrics);

trackRouter.get("/:trackId/credits", getTrackCredits);

trackRouter.get("/:trackId/recommendations", getTrackRecommendations);

trackRouter.post("/artist/upload/track", isAuthenticated, authRole(["artist"]),  upload.single("file"), uploadTrack);


trackRouter.patch("/artist/:trackId", isAuthenticated, authRole(["artist"]),  updateTrack);

trackRouter.delete("/artist/:trackId", isAuthenticated , authRole(["artist"]),  deleteTrack);

export default trackRouter;