import { Router } from "express";
import {
  getArtist,
  getArtistTopTracks,
  getArtistAlbums,
  getArtistSingles,
  getArtistAppearsOn,
  getArtistFollowers,
  getArtistAnalytics,
  updateArtistProfile
} from "../controllers/artist.controller.js";

const artistRouter = Router();

artistRouter.get("/:artistId", getArtist);

artistRouter.get("/:artistId/top-tracks", getArtistTopTracks);

artistRouter.get("/:artistId/albums", getArtistAlbums);

artistRouter.get("/:artistId/singles", getArtistSingles);

artistRouter.get("/:artistId/appears-on", getArtistAppearsOn);

artistRouter.get("/:artistId/followers", getArtistFollowers);

artistRouter.get("/me/analytics", getArtistAnalytics);

artistRouter.patch("/me/profile", updateArtistProfile);

export default artistRouter;