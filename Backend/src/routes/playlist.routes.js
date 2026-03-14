import { Router } from "express";
import { addTrackToPlaylist, createPlaylist, deletePlaylist, getPlaylist, getUserPlaylists, removeTrackFromPlaylist, updatePlaylist } from "../controllers/playlist.controller.js";

const playlistRouter = Router();

playlistRouter.post("/", createPlaylist);

playlistRouter.get("/:playlistId", getPlaylist);

playlistRouter.patch("/:playlistId", updatePlaylist);

playlistRouter.delete("/:playlistId", deletePlaylist);

playlistRouter.post("/:playlistId/tracks", addTrackToPlaylist);

playlistRouter.delete("/:playlistId/tracks/:trackId", removeTrackFromPlaylist);

playlistRouter.get("/me/playlists", getUserPlaylists);

export default playlistRouter;