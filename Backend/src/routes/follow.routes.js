import { Router } from "express";
import { followArtist, getArtistFollowers, unfollowArtist } from "../controllers/follow.controller.js";


const followRouter = Router();

// ARTIST FOLLOW SYSTEM
followRouter.post("/artist/:artistId", followArtist);
followRouter.delete("/artist/:artistId", unfollowArtist);
followRouter.get("/artist/:artistId/followers", getArtistFollowers);


export default followRouter;