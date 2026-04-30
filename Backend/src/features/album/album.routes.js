import { Router } from "express";
import {
    createAlbum,
    deleteAlbum,
    getAlbum,
    getAlbumTracks,
    getArtistAlbums,
    updateAlbum,
} from "./album.controller.js";

const router = Router();

router.post("/artist", createAlbum);
router.get("/artist/:artistId", getArtistAlbums);
router.get("/:albumId", getAlbum);
router.patch("/:albumId", updateAlbum);
router.delete("/:albumId", deleteAlbum);
router.get("/:albumId/tracks", getAlbumTracks);

export default router;
