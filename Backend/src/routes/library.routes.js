import { Router } from "express";
import { getLikedTracks, likeTrack, unlikeTrack } from "../controllers/library.controller.js";

const libraryRouter = Router();

// TRACK LIBRARY
libraryRouter.get("/tracks", getLikedTracks);
libraryRouter.post("/tracks/:trackId", likeTrack);
libraryRouter.delete("/tracks/:trackId", unlikeTrack);


export default libraryRouter;