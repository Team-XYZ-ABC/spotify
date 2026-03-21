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
  uploadSingle,
  uploadImage,
  uploadTrack,
  uploadMultiple
} from "../controllers/track.controller.js";
import upload from "../middlewares/multer.js";

const trackRouter = Router();

trackRouter.get("/:trackId", getTrack);

trackRouter.get("/:trackId/stream", streamTrack);

trackRouter.post("/:trackId/like", likeTrack);

trackRouter.delete("/:trackId/like", unlikeTrack);

trackRouter.get("/:trackId/lyrics", getTrackLyrics);

trackRouter.get("/:trackId/credits", getTrackCredits);

trackRouter.get("/:trackId/recommendations", getTrackRecommendations);

trackRouter.post("/artist/upload/single",upload.single("file"), uploadSingle);

trackRouter.post("/artist/upload/image",upload.single("file"), uploadImage);

trackRouter.post("/artist/upload/track",upload.single("file"), uploadTrack);

trackRouter.post("/artist/upload/multiple",upload.array("files"), uploadMultiple);


trackRouter.patch("/artist/:trackId", updateTrack);

trackRouter.delete("/artist/:trackId", deleteTrack);

export default trackRouter;