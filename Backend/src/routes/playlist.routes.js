import { Router } from "express";
import { addTrackToPlaylist, createPlaylist, deletePlaylist, followPlaylist, getFeaturedPlaylists, getPlaylist, getPlaylistFollowers, getUserPlaylists, removeTrackFromPlaylist, reorderPlaylistTracks, unfollowPlaylist, updatePlaylist } from "../controllers/playlist.controller.js";

const playlistRouter = Router();

playlistRouter.post("/", createPlaylist);

playlistRouter.get("/:playlistId", getPlaylist);

playlistRouter.patch("/:playlistId", updatePlaylist);

playlistRouter.delete("/:playlistId", deletePlaylist);

playlistRouter.post("/:playlistId/tracks", addTrackToPlaylist);

playlistRouter.delete("/:playlistId/tracks/:trackId", removeTrackFromPlaylist);

playlistRouter.patch("/:playlistId/reorder", reorderPlaylistTracks);

playlistRouter.post("/:playlistId/follow", followPlaylist);

playlistRouter.delete("/:playlistId/follow", unfollowPlaylist);

playlistRouter.get("/:playlistId/followers", getPlaylistFollowers);

playlistRouter.get("/featured/all", getFeaturedPlaylists);

playlistRouter.get("/me/playlists", getUserPlaylists);

export default playlistRouter;