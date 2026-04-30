import asyncHandler from "../../core/http/async-handler.js";
import response from "../../core/http/api-response.js";
import playlistService from "./playlist.service.js";

export const createPlaylist = asyncHandler(async (req, res) => {
    const playlist = await playlistService.createPlaylist(req.user.id, req.body);
    return response.created(res, { message: "Playlist created successfully", playlist });
});

export const getPlaylist = asyncHandler(async (req, res) => {
    const playlist = await playlistService.getPlaylist(req.params.playlistId, req.user.id);
    return response.ok(res, { message: "Playlist fetched successfully", playlist });
});

export const updatePlaylist = asyncHandler(async (req, res) => {
    const playlist = await playlistService.updatePlaylist(
        req.params.playlistId,
        req.user.id,
        req.body
    );
    return response.ok(res, { message: "Playlist updated successfully", playlist });
});

export const deletePlaylist = asyncHandler(async (req, res) => {
    await playlistService.deletePlaylist(req.params.playlistId);
    return response.ok(res, {
        message: "Playlist deleted successfully",
        playlistId: req.params.playlistId,
    });
});

export const addCollaborators = asyncHandler(async (req, res) => {
    const playlist = await playlistService.addCollaborators(
        req.playlist,
        req.user.id,
        req.body.collaboratorIds
    );
    return response.ok(res, { message: "Collaborators added successfully", playlist });
});

export const removeCollaborator = asyncHandler(async (req, res) => {
    const playlist = await playlistService.removeCollaborator(
        req.playlist,
        req.user.id,
        req.params.userId
    );
    return response.ok(res, { message: "Collaborator removed successfully", playlist });
});

export const addTrackToPlaylist = asyncHandler(async (req, res) => {
    const playlist = await playlistService.addTrack(
        req.playlist,
        req.user.id,
        req.body.trackId
    );
    return response.ok(res, { message: "Track added to playlist", playlist });
});

export const removeTrackFromPlaylist = asyncHandler(async (req, res) => {
    const playlist = await playlistService.removeTrack(
        req.playlist,
        req.user.id,
        req.params.trackId
    );
    return response.ok(res, { message: "Track removed from playlist", playlist });
});

export const reorderPlaylistTracks = asyncHandler(async (req, res) => {
    const playlist = await playlistService.reorderTracks(
        req.playlist,
        req.user.id,
        req.body.sourceIndex,
        req.body.destinationIndex
    );
    return response.ok(res, { message: "Playlist reordered successfully", playlist });
});

export const getUserPlaylists = asyncHandler(async (req, res) => {
    const playlists = await playlistService.listMyPlaylists(req.user.id);
    return response.ok(res, { message: "Playlists fetched", playlists });
});

export const searchUsersForCollaborators = asyncHandler(async (req, res) => {
    const users = await playlistService.searchUsersForCollaborators(
        req.user?.id || req.user?._id,
        req.query.q
    );
    return response.ok(res, { users });
});

export const searchTracksForPlaylist = asyncHandler(async (req, res) => {
    const tracks = await playlistService.searchTracksForPlaylist(
        req.query.q,
        req.query.excludePlaylistId
    );
    return response.ok(res, { tracks });
});
