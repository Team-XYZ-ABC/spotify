import mongoose from "mongoose";
import * as playlistDao from "./playlist.dao.js";
import * as userDao from "../user/user.dao.js";
import * as trackDao from "../track/track.dao.js";
import UserModel from "../user/user.model.js";
import {
    mapPlaylist,
    mapTrackForPicker,
    mapCollaboratorUser,
} from "./playlist.mapper.js";
import ApiError from "../../lib/api-error.js";
import { PLAYLIST_LIMITS } from "../../constants.js";

const parseCollaboratorIds = (ids) => {
    if (!ids) return [];
    if (!Array.isArray(ids)) return null;
    const filtered = ids.map((id) => String(id ?? "").trim()).filter(Boolean);
    return [...new Set(filtered)];
};

const createPlaylist = async (
    userId,
    { name, description = "", coverImage = "", collaboratorIds = [] }
) => {
    if (!name?.trim()) throw ApiError.badRequest("Playlist name is required");

    const parsed = parseCollaboratorIds(collaboratorIds);
    if (parsed === null)
        throw ApiError.badRequest("collaboratorIds must be an array of user IDs");

    const collaborators = parsed.filter((id) => id !== String(userId));
    if (collaborators.length > PLAYLIST_LIMITS.MAX_COLLABORATORS) {
        throw ApiError.badRequest(
            `Maximum ${PLAYLIST_LIMITS.MAX_COLLABORATORS} collaborators are allowed`
        );
    }

    if (collaborators.length) {
        const count = await userDao.count({ _id: { $in: collaborators } });
        if (count !== collaborators.length) {
            throw ApiError.badRequest("One or more collaborators are invalid");
        }
    }

    const created = await playlistDao.create({
        name: name.trim(),
        description: description.trim(),
        coverImage,
        owner: userId,
        collaborators,
    });

    const saved = await playlistDao.findByIdPopulated(created._id);
    return mapPlaylist(saved, userId);
};

const getPlaylist = async (playlistId, userId) => {
    const playlist = await playlistDao.findByIdPopulated(playlistId);
    if (!playlist) throw ApiError.notFound("Playlist not found");

    const uid = String(userId);
    const isOwner = String(playlist.owner?._id) === uid;
    const isCollaborator = (playlist.collaborators || []).some(
        (u) => String(u?._id) === uid
    );

    if (!playlist.isPublic && !isOwner && !isCollaborator) {
        throw ApiError.forbidden("You cannot view this playlist");
    }
    return mapPlaylist(playlist, userId);
};

const updatePlaylist = async (playlistId, userId, body) => {
    const { name, description, coverImage, isPublic } = body;
    if (name !== undefined && !String(name).trim()) {
        throw ApiError.badRequest("Playlist name cannot be empty");
    }
    const updateData = {};
    if (name !== undefined) updateData.name = String(name).trim();
    if (description !== undefined) updateData.description = String(description).trim();
    if (coverImage !== undefined) updateData.coverImage = coverImage;
    if (isPublic !== undefined) updateData.isPublic = Boolean(isPublic);

    const updated = await playlistDao.updateByIdPopulated(playlistId, updateData);
    return mapPlaylist(updated, userId);
};

const deletePlaylist = async (playlistId) => {
    await playlistDao.deleteById(playlistId);
};

const addCollaborators = async (playlist, userId, collaboratorIds) => {
    const parsed = parseCollaboratorIds(collaboratorIds);
    if (!parsed?.length)
        throw ApiError.badRequest("collaboratorIds must be a non-empty array");

    const ownerId = String(playlist.owner);
    const requested = parsed.filter((id) => id !== ownerId);

    const validUsers = await UserModel.aggregate([
        {
            $match: {
                _id: { $in: requested.map((id) => new mongoose.Types.ObjectId(id)) },
            },
        },
        { $project: { _id: 1 } },
    ]);
    const validIds = validUsers.map((u) => String(u._id));
    if (validIds.length !== requested.length) {
        throw ApiError.badRequest("One or more collaborators are invalid");
    }

    const updated = await playlistDao.updateWithPipelinePopulated(
        { _id: playlist._id },
        [
            {
                $set: {
                    collaborators: {
                        $slice: [
                            {
                                $setUnion: [
                                    { $ifNull: ["$collaborators", []] },
                                    validIds.map((id) => new mongoose.Types.ObjectId(id)),
                                ],
                            },
                            PLAYLIST_LIMITS.MAX_COLLABORATORS,
                        ],
                    },
                },
            },
        ]
    );
    return mapPlaylist(updated, userId);
};

const removeCollaborator = async (playlist, userId, collaboratorUserId) => {
    if (!mongoose.Types.ObjectId.isValid(collaboratorUserId)) {
        throw ApiError.badRequest("Invalid user ID");
    }
    const updated = await playlistDao.updateByIdPopulated(playlist._id, {
        $pull: { collaborators: collaboratorUserId },
    });
    return mapPlaylist(updated, userId);
};

const addTrack = async (playlist, userId, trackId) => {
    if (!trackId) throw ApiError.badRequest("trackId is required");
    if ((playlist.tracks || []).length >= PLAYLIST_LIMITS.MAX_TRACKS) {
        throw ApiError.badRequest(
            `Maximum ${PLAYLIST_LIMITS.MAX_TRACKS} tracks allowed in a playlist`
        );
    }
    const track = await trackDao.findById(trackId, { select: "_id" });
    if (!track) throw ApiError.notFound("Track not found");
    const exists = (playlist.tracks || []).some(
        (t) => String(t.track) === String(trackId)
    );
    if (exists) throw ApiError.badRequest("Track already exists in playlist");

    playlist.tracks.push({
        track: track._id,
        addedBy: userId,
        addedAt: new Date(),
    });
    await playlist.save();

    const updated = await playlistDao.findByIdPopulated(playlist._id);
    return mapPlaylist(updated, userId);
};

const removeTrack = async (playlist, userId, trackId) => {
    const before = playlist.tracks.length;
    playlist.tracks = playlist.tracks.filter(
        (t) => String(t.track) !== String(trackId)
    );
    if (before === playlist.tracks.length) {
        throw ApiError.notFound("Track not found in playlist");
    }
    await playlist.save();
    const updated = await playlistDao.findByIdPopulated(playlist._id);
    return mapPlaylist(updated, userId);
};

const reorderTracks = async (playlist, userId, sourceIndex, destinationIndex) => {
    const from = Number(sourceIndex);
    const to = Number(destinationIndex);
    if (!Number.isInteger(from) || !Number.isInteger(to)) {
        throw ApiError.badRequest("sourceIndex and destinationIndex must be integers");
    }
    if (
        from < 0 ||
        to < 0 ||
        from >= playlist.tracks.length ||
        to >= playlist.tracks.length
    ) {
        throw ApiError.badRequest("Invalid reorder indexes");
    }
    if (from === to) {
        const same = await playlistDao.findByIdPopulated(playlist._id);
        return mapPlaylist(same, userId);
    }
    const next = [...playlist.tracks];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    playlist.tracks = next;
    await playlist.save();

    const updated = await playlistDao.findByIdPopulated(playlist._id);
    return mapPlaylist(updated, userId);
};

const listMyPlaylists = async (userId) => {
    const playlists = await playlistDao.findForUser(userId);
    return Promise.all(playlists.map((p) => mapPlaylist(p, userId)));
};

const searchUsersForCollaborators = async (currentUserId, queryString) => {
    const query = String(queryString || "").trim();
    if (!query) return [];

    let users = [];
    try {
        users = await UserModel.aggregate([
            {
                $search: {
                    index: "user_search_by_displayname_username_email",
                    compound: {
                        should: [
                            {
                                autocomplete: {
                                    query,
                                    path: "username",
                                    score: { boost: { value: 5 } },
                                },
                            },
                            {
                                text: {
                                    query,
                                    path: "email",
                                    score: { boost: { value: 3 } },
                                },
                            },
                            {
                                text: {
                                    query,
                                    path: "displayName",
                                    fuzzy: { maxEdits: 2 },
                                    score: { boost: { value: 2 } },
                                },
                            },
                        ],
                    },
                },
            },
            {
                $match: {
                    _id: currentUserId
                        ? { $ne: new mongoose.Types.ObjectId(currentUserId) }
                        : { $exists: true },
                },
            },
            { $limit: 10 },
            {
                $project: {
                    _id: 1,
                    username: 1,
                    email: 1,
                    displayName: 1,
                    avatar: 1,
                    avatarKey: 1,
                },
            },
        ]);
    } catch {
        // Atlas Search not available — fall back below
    }

    if (!users.length) {
        const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
        users = await UserModel.find({
            ...(currentUserId ? { _id: { $ne: currentUserId } } : {}),
            $or: [{ username: regex }, { email: regex }, { displayName: regex }],
        })
            .select("_id username email displayName avatar avatarKey")
            .limit(10)
            .lean();
    }

    return Promise.all(users.map(mapCollaboratorUser));
};

const searchTracksForPlaylist = async (queryString, excludePlaylistId) => {
    const tracks = await trackDao.searchByTitle(queryString);
    let excluded = new Set();
    if (
        excludePlaylistId &&
        mongoose.Types.ObjectId.isValid(excludePlaylistId)
    ) {
        const playlist = await playlistDao.selectTracks(excludePlaylistId);
        if (playlist) {
            excluded = new Set(playlist.tracks.map((pt) => String(pt.track)));
        }
    }
    const filtered = tracks.filter((t) => !excluded.has(String(t._id)));
    return Promise.all(filtered.map(mapTrackForPicker));
};

export default {
    createPlaylist,
    getPlaylist,
    updatePlaylist,
    deletePlaylist,
    addCollaborators,
    removeCollaborator,
    addTrack,
    removeTrack,
    reorderTracks,
    listMyPlaylists,
    searchUsersForCollaborators,
    searchTracksForPlaylist,
};
