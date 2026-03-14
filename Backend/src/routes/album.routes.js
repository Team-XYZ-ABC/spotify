import { Router } from "express";
import {
  createAlbum,
  getAlbum,
  updateAlbum,
  deleteAlbum,
  getAlbumTracks,
  getArtistAlbums
} from "../controllers/album.controller.js";

const albumRouter = Router();

albumRouter.post("/artist", createAlbum);

albumRouter.get("/:albumId", getAlbum);

albumRouter.patch("/:albumId", updateAlbum);

albumRouter.delete("/:albumId", deleteAlbum);

albumRouter.get("/:albumId/tracks", getAlbumTracks);

albumRouter.get("/artist/:artistId", getArtistAlbums);

export default albumRouter;
