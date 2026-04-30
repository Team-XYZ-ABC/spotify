import { Router } from "express";
import { getLikedTracks, likeTrack, unlikeTrack } from "./library.controller.js";

const router = Router();

router.get("/tracks", getLikedTracks);
router.post("/tracks/:trackId", likeTrack);
router.delete("/tracks/:trackId", unlikeTrack);

export default router;
