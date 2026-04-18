import {
    Router
} from "express";
import isAuthenticated from "../middlewares/auth.middleware.js";
import {
    addCollaborators,
    addTrackToPlaylist,
    createPlaylist,
    deletePlaylist,
    getPlaylist,
    getUserPlaylists,
    removeCollaborator,
    removeTrackFromPlaylist,
    reorderPlaylistTracks,
    searchTracksForPlaylist,
    searchUsersForCollaborators,
    updatePlaylist,
} from "../controllers/playlist.controller.js";
import {
    canManagePlaylist,
    canModifyPlaylistTracks,
    loadPlaylist,
} from "../middlewares/playlist.middleware.js";

const playlistRouter = Router();

playlistRouter.use(isAuthenticated);

playlistRouter.get("/me/playlists", getUserPlaylists);

playlistRouter.get("/users/search", searchUsersForCollaborators);

playlistRouter.get("/tracks/search", searchTracksForPlaylist);

playlistRouter.post("/", createPlaylist);

playlistRouter.get("/:playlistId", loadPlaylist, getPlaylist);

playlistRouter.patch("/:playlistId", loadPlaylist, canManagePlaylist, updatePlaylist);

playlistRouter.delete("/:playlistId", loadPlaylist, canManagePlaylist, deletePlaylist);

playlistRouter.post(
    "/:playlistId/collaborators",
    loadPlaylist,
    canManagePlaylist,
    addCollaborators
);

playlistRouter.delete(
    "/:playlistId/collaborators/:userId",
    loadPlaylist,
    canManagePlaylist,
    removeCollaborator
);

playlistRouter.post("/:playlistId/tracks", loadPlaylist, canModifyPlaylistTracks, addTrackToPlaylist);

playlistRouter.delete(
    "/:playlistId/tracks/:trackId",
    loadPlaylist,
    canModifyPlaylistTracks,
    removeTrackFromPlaylist
);

playlistRouter.patch(
    "/:playlistId/tracks/reorder",
    loadPlaylist,
    canModifyPlaylistTracks,
    reorderPlaylistTracks
);

export default playlistRouter;