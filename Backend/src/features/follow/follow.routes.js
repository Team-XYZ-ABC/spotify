import { Router } from "express";
import authRole from "../../middlewares/authRole.middleware.js";
import {
    followArtist,
    getArtistFollowers,
    unfollowArtist,
} from "./follow.controller.js";
import { ROLES } from "../../core/constants/index.js";

const router = Router();

router.post("/artist/:artistId", followArtist);
router.delete("/artist/:artistId", unfollowArtist);
router.get(
    "/artist/:artistId/followers",
    authRole([ROLES.ARTIST]),
    getArtistFollowers
);

export default router;
