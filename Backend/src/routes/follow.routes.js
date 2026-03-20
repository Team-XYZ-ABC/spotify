import { Router } from "express";
import { followArtist, getArtistFollowers, unfollowArtist } from "../controllers/follow.controller.js";


const followRouter = Router();

followRouter.post("/artist/:artistId", followArtist);
followRouter.delete("/artist/:artistId", unfollowArtist);
followRouter.get("/artist/:artistId/followers", authRole('artist'), getArtistFollowers);


export default followRouter;