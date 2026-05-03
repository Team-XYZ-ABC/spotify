import { Router } from "express";
import {
    addToQueue,
    getCurrentPlayback,
    getQueue,
    nextTrack,
    pauseTrack,
    playTrack,
    previousTrack,
} from "./player.controller.js";

const router = Router();

router.get("/", getCurrentPlayback);
router.post("/play", playTrack);
router.post("/pause", pauseTrack);
router.post("/next", nextTrack);
router.post("/previous", previousTrack);
router.post("/queue", addToQueue);
router.get("/queue", getQueue);

export default router;
