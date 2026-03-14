import { Router } from "express";
import { addToQueue, getCurrentPlayback, getQueue, nextTrack, pauseTrack, playTrack, previousTrack } from "../controllers/player.controller.js";

const playerRouter = Router();

playerRouter.get("/", getCurrentPlayback);

playerRouter.post("/play", playTrack);

playerRouter.post("/pause", pauseTrack);

playerRouter.post("/next", nextTrack);

playerRouter.post("/previous", previousTrack);

playerRouter.post("/queue", addToQueue);

playerRouter.get("/queue", getQueue);

export default playerRouter;