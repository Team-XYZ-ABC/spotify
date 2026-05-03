import { Router } from "express";
import isAuthenticated from "../../middlewares/auth.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
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
} from "./playlist.controller.js";
import {
    canManagePlaylist,
    canModifyPlaylistTracks,
    loadPlaylist,
} from "./playlist.middleware.js";
import {
    addCollaboratorsSchema,
    addTrackSchema,
    createPlaylistSchema,
    reorderTracksSchema,
    updatePlaylistSchema,
} from "./playlist.validation.js";

const router = Router();
router.use(isAuthenticated);

router.get("/me/playlists", getUserPlaylists);
router.get("/users/search", searchUsersForCollaborators);
router.get("/tracks/search", searchTracksForPlaylist);

router.post("/", validate(createPlaylistSchema), createPlaylist);
router.get("/:playlistId", loadPlaylist, getPlaylist);
router.patch(
    "/:playlistId",
    loadPlaylist,
    canManagePlaylist,
    validate(updatePlaylistSchema),
    updatePlaylist
);
router.delete("/:playlistId", loadPlaylist, canManagePlaylist, deletePlaylist);

router.post(
    "/:playlistId/collaborators",
    loadPlaylist,
    canManagePlaylist,
    validate(addCollaboratorsSchema),
    addCollaborators
);
router.delete(
    "/:playlistId/collaborators/:userId",
    loadPlaylist,
    canManagePlaylist,
    removeCollaborator
);

router.post(
    "/:playlistId/tracks",
    loadPlaylist,
    canModifyPlaylistTracks,
    validate(addTrackSchema),
    addTrackToPlaylist
);
router.delete(
    "/:playlistId/tracks/:trackId",
    loadPlaylist,
    canModifyPlaylistTracks,
    removeTrackFromPlaylist
);
router.patch(
    "/:playlistId/tracks/reorder",
    loadPlaylist,
    canModifyPlaylistTracks,
    validate(reorderTracksSchema),
    reorderPlaylistTracks
);

export default router;
