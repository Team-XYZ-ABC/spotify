import { Router } from "express";
import {
    getArtist,
    getArtistAlbums,
    getArtistAnalytics,
    getArtistAppearsOn,
    getArtistFollowers,
    getArtistSingles,
    getArtistTopTracks,
    updateArtistProfile,
} from "./artist.controller.js";

const router = Router();

router.get("/me/analytics", getArtistAnalytics);
router.patch("/me/profile", updateArtistProfile);
router.get("/:artistId", getArtist);
router.get("/:artistId/top-tracks", getArtistTopTracks);
router.get("/:artistId/albums", getArtistAlbums);
router.get("/:artistId/singles", getArtistSingles);
router.get("/:artistId/appears-on", getArtistAppearsOn);
router.get("/:artistId/followers", getArtistFollowers);

export default router;
