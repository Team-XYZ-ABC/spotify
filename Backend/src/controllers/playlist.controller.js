import mongoose from "mongoose";
import PlaylistModel from "../models/playlist.model.js";
import TrackModel from "../models/track.model.js";
import UserModel from "../models/user.model.js";

const MAX_COLLABORATORS = 10;

const formatDuration = (seconds = 0) => {
  const safeSeconds = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
  const minutes = Math.floor(safeSeconds / 60);
  const remain = safeSeconds % 60;
  return `${minutes}:${String(remain).padStart(2, "0")}`;
};

const mapTrack = (playlistTrack) => {
  const trackDoc = playlistTrack?.track;

  if (!trackDoc || typeof trackDoc !== "object") {
    return null;
  }

  const mainArtist = trackDoc.primaryArtist?.stageName || "Unknown artist";
  const featuredArtists = Array.isArray(trackDoc.artists)
    ? trackDoc.artists
      .map((artist) => artist?.stageName)
      .filter(Boolean)
      .filter((name) => name !== mainArtist)
    : [];

  return {
    id: trackDoc._id,
    title: trackDoc.title,
    artist: [mainArtist, ...featuredArtists].join(", "),
    album: trackDoc.album?.title || "Single",
    duration: formatDuration(trackDoc.duration),
    durationSeconds: trackDoc.duration,
    image: trackDoc.coverImage || "",
    addedAt: playlistTrack.addedAt,
    addedBy: playlistTrack.addedBy,
  };
};

const mapUser = (userDoc) => ({
  id: userDoc?._id,
  username: userDoc?.username,
  email: userDoc?.email,
  displayName: userDoc?.displayName,
  avatar: userDoc?.avatar || "",
});

const mapPlaylist = (playlistDoc, currentUserId) => {
  const tracks = (playlistDoc.tracks || []).map(mapTrack).filter(Boolean);
  const totalDurationSeconds = tracks.reduce(
    (sum, track) => sum + (track.durationSeconds || 0),
    0
  );

  return {
    id: playlistDoc._id,
    name: playlistDoc.name,
    description: playlistDoc.description,
    coverImage: playlistDoc.coverImage,
    isPublic: playlistDoc.isPublic,
    owner: mapUser(playlistDoc.owner),
    collaborators: (playlistDoc.collaborators || []).map(mapUser),
    songCount: tracks.length,
    totalDurationSeconds,
    tracks,
    permissions: {
      isOwner: String(playlistDoc.owner?._id) === String(currentUserId),
      isCollaborator: (playlistDoc.collaborators || []).some(
        (user) => String(user?._id) === String(currentUserId)
      ),
    },
    createdAt: playlistDoc.createdAt,
    updatedAt: playlistDoc.updatedAt,
  };
};

const playlistPopulate = [
  {
    path: "owner",
    select: "displayName username email avatar",
  },
  {
    path: "collaborators",
    select: "displayName username email avatar",
  },
  {
    path: "tracks.track",
    select: "title duration coverImage primaryArtist artists album",
    populate: [
      { path: "primaryArtist", select: "stageName" },
      { path: "artists", select: "stageName" },
      { path: "album", select: "title" },
    ],
  },
];

const parseCollaboratorIds = (collaboratorIds) => {
  if (!collaboratorIds) return [];

  if (!Array.isArray(collaboratorIds)) return null;

  const filtered = collaboratorIds
    .map((id) => String(id || "").trim())
    .filter(Boolean);

  return [...new Set(filtered)];
};

export const createPlaylist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, description = "", coverImage = "", collaboratorIds = [] } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Playlist name is required" });
    }

    const parsedCollaboratorIds = parseCollaboratorIds(collaboratorIds);

    if (parsedCollaboratorIds === null) {
      return res
        .status(400)
        .json({ message: "collaboratorIds must be an array of user IDs" });
    }

    const cleanedCollaboratorIds = parsedCollaboratorIds.filter(
      (id) => id !== String(userId)
    );

    if (cleanedCollaboratorIds.length > MAX_COLLABORATORS) {
      return res.status(400).json({
        message: `Maximum ${MAX_COLLABORATORS} collaborators are allowed`,
      });
    }

    if (cleanedCollaboratorIds.length > 0) {
      const existingUsers = await UserModel.countDocuments({
        _id: { $in: cleanedCollaboratorIds },
      });

      if (existingUsers !== cleanedCollaboratorIds.length) {
        return res.status(400).json({
          message: "One or more collaborators are invalid",
        });
      }
    }

    const playlist = await PlaylistModel.create({
      name: name.trim(),
      description: description.trim(),
      coverImage,
      owner: userId,
      collaborators: cleanedCollaboratorIds,
    });

    const saved = await PlaylistModel.findById(playlist._id).populate(playlistPopulate);

    return res.status(201).json({
      message: "Playlist created successfully",
      playlist: mapPlaylist(saved, userId),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

export const getPlaylist = async (req, res) => {
  try {
    const playlist = await PlaylistModel.findById(req.params.playlistId).populate(
      playlistPopulate
    );

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    const userId = String(req.user.id);
    const isOwner = String(playlist.owner?._id) === userId;
    const isCollaborator = (playlist.collaborators || []).some(
      (user) => String(user?._id) === userId
    );

    if (!playlist.isPublic && !isOwner && !isCollaborator) {
      return res.status(403).json({ message: "You cannot view this playlist" });
    }

    return res.status(200).json({
      message: "Playlist fetched successfully",
      playlist: mapPlaylist(playlist, req.user.id),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

export const updatePlaylist = async (req, res) => {
  try {
    const { name, description, coverImage, isPublic } = req.body;

    if (name !== undefined && !String(name).trim()) {
      return res.status(400).json({ message: "Playlist name cannot be empty" });
    }

    const updateData = {};

    if (name !== undefined) updateData.name = String(name).trim();
    if (description !== undefined) updateData.description = String(description).trim();
    if (coverImage !== undefined) updateData.coverImage = coverImage;
    if (isPublic !== undefined) updateData.isPublic = Boolean(isPublic);

    const updated = await PlaylistModel.findByIdAndUpdate(
      req.params.playlistId,
      updateData,
      {
        new: true,
      }
    ).populate(playlistPopulate);

    return res.status(200).json({
      message: "Playlist updated successfully",
      playlist: mapPlaylist(updated, req.user.id),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

export const deletePlaylist = async (req, res) => {
  try {
    await PlaylistModel.findByIdAndDelete(req.params.playlistId);

    return res.status(200).json({
      message: "Playlist deleted successfully",
      playlistId: req.params.playlistId,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

export const addCollaborators = async (req, res) => {
  try {
    const { collaboratorIds = [] } = req.body;
    const playlist = req.playlist;
    const ownerId = String(playlist.owner);
    const parsedCollaboratorIds = parseCollaboratorIds(collaboratorIds);

    if (parsedCollaboratorIds === null || parsedCollaboratorIds.length === 0) {
      return res.status(400).json({
        message: "collaboratorIds must be a non-empty array",
      });
    }

    const requestedIds = parsedCollaboratorIds.filter((id) => id !== ownerId);
    const uniqueCurrentIds = new Set((playlist.collaborators || []).map((id) => String(id)));

    const toAdd = requestedIds.filter((id) => !uniqueCurrentIds.has(id));

    if (toAdd.length === 0) {
      const populatedPlaylist = await PlaylistModel.findById(playlist._id).populate(
        playlistPopulate
      );

      return res.status(200).json({
        message: "All collaborators are already added",
        playlist: mapPlaylist(populatedPlaylist, req.user.id),
      });
    }

    if (uniqueCurrentIds.size + toAdd.length > MAX_COLLABORATORS) {
      return res.status(400).json({
        message: `Maximum ${MAX_COLLABORATORS} collaborators are allowed`,
      });
    }

    const users = await UserModel.find({ _id: { $in: toAdd } }).select("_id");

    if (users.length !== toAdd.length) {
      return res.status(400).json({ message: "One or more collaborators are invalid" });
    }

    const updated = await PlaylistModel.findByIdAndUpdate(
      playlist._id,
      { $addToSet: { collaborators: { $each: toAdd } } },
      { new: true }
    ).populate(playlistPopulate);

    return res.status(200).json({
      message: "Collaborators added successfully",
      playlist: mapPlaylist(updated, req.user.id),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

export const removeCollaborator = async (req, res) => {
  try {
    const { userId } = req.params;
    const playlist = req.playlist;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const updated = await PlaylistModel.findByIdAndUpdate(
      playlist._id,
      { $pull: { collaborators: userId } },
      { new: true }
    ).populate(playlistPopulate);

    return res.status(200).json({
      message: "Collaborator removed successfully",
      playlist: mapPlaylist(updated, req.user.id),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

export const addTrackToPlaylist = async (req, res) => {
  try {
    const { trackId } = req.body;
    const playlist = req.playlist;

    if (!trackId) {
      return res.status(400).json({ message: "trackId is required" });
    }

    const track = await TrackModel.findById(trackId).select("_id");

    if (!track) {
      return res.status(404).json({ message: "Track not found" });
    }

    const alreadyExists = (playlist.tracks || []).some(
      (playlistTrack) => String(playlistTrack.track) === String(trackId)
    );

    if (alreadyExists) {
      return res.status(400).json({ message: "Track already exists in playlist" });
    }

    playlist.tracks.push({
      track: track._id,
      addedBy: req.user.id,
      addedAt: new Date(),
    });

    await playlist.save();

    const updated = await PlaylistModel.findById(playlist._id).populate(playlistPopulate);

    return res.status(200).json({
      message: "Track added to playlist",
      playlist: mapPlaylist(updated, req.user.id),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

export const removeTrackFromPlaylist = async (req, res) => {
  try {
    const { trackId } = req.params;
    const playlist = req.playlist;

    const beforeCount = playlist.tracks.length;
    playlist.tracks = playlist.tracks.filter(
      (playlistTrack) => String(playlistTrack.track) !== String(trackId)
    );

    if (beforeCount === playlist.tracks.length) {
      return res.status(404).json({ message: "Track not found in playlist" });
    }

    await playlist.save();

    const updated = await PlaylistModel.findById(playlist._id).populate(playlistPopulate);

    return res.status(200).json({
      message: "Track removed from playlist",
      playlist: mapPlaylist(updated, req.user.id),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

export const reorderPlaylistTracks = async (req, res) => {
  try {
    const { sourceIndex, destinationIndex } = req.body;
    const playlist = req.playlist;

    const from = Number(sourceIndex);
    const to = Number(destinationIndex);

    if (!Number.isInteger(from) || !Number.isInteger(to)) {
      return res.status(400).json({ message: "sourceIndex and destinationIndex must be integers" });
    }

    if (
      from < 0 ||
      to < 0 ||
      from >= playlist.tracks.length ||
      to >= playlist.tracks.length
    ) {
      return res.status(400).json({ message: "Invalid reorder indexes" });
    }

    if (from === to) {
      const samePlaylist = await PlaylistModel.findById(playlist._id).populate(playlistPopulate);
      return res.status(200).json({
        message: "Playlist order unchanged",
        playlist: mapPlaylist(samePlaylist, req.user.id),
      });
    }

    const nextTracks = [...playlist.tracks];
    const [movedItem] = nextTracks.splice(from, 1);
    nextTracks.splice(to, 0, movedItem);

    playlist.tracks = nextTracks;
    await playlist.save();

    const updated = await PlaylistModel.findById(playlist._id).populate(playlistPopulate);

    return res.status(200).json({
      message: "Playlist reordered successfully",
      playlist: mapPlaylist(updated, req.user.id),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

export const searchUsersForCollaborators = async (req, res) => {
  try {
    const query = String(req.query.q || "").trim();

    if (!query) {
      return res.status(200).json({ users: [] });
    }

    const regex = new RegExp(query, "i");
    const users = await UserModel.find({
      _id: { $ne: req.user.id },
      $or: [{ username: regex }, { email: regex }, { displayName: regex }],
    })
      .select("_id username email displayName avatar")
      .limit(10)
      .lean();

    return res.status(200).json({
      users: users.map((user) => ({
        id: user._id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        avatar: user.avatar || "",
      })),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

export const searchTracksForPlaylist = async (req, res) => {
  try {
    const query = String(req.query.q || "").trim();
    const excludePlaylistId = String(req.query.excludePlaylistId || "").trim();

    const filter = {};

    if (query) {
      const regex = new RegExp(query, "i");
      filter.$or = [{ title: regex }];
    }

    const tracks = await TrackModel.find(filter)
      .select("title duration coverImage primaryArtist artists album")
      .populate("primaryArtist", "stageName")
      .populate("artists", "stageName")
      .populate("album", "title")
      .limit(20);

    let excludedTrackIds = new Set();

    if (excludePlaylistId && mongoose.Types.ObjectId.isValid(excludePlaylistId)) {
      const playlist = await PlaylistModel.findById(excludePlaylistId).select("tracks");

      if (playlist) {
        excludedTrackIds = new Set(
          playlist.tracks.map((playlistTrack) => String(playlistTrack.track))
        );
      }
    }

    const data = tracks
      .filter((track) => !excludedTrackIds.has(String(track._id)))
      .map((track) => ({
        id: track._id,
        title: track.title,
        duration: formatDuration(track.duration),
        durationSeconds: track.duration,
        image: track.coverImage || "",
        album: track.album?.title || "Single",
        artist:
          track.primaryArtist?.stageName ||
          track.artists?.[0]?.stageName ||
          "Unknown artist",
      }));

    return res.status(200).json({ tracks: data });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

export const getUserPlaylists = async (req, res) => {
  try {
    const userId = req.user.id;
    const playlists = await PlaylistModel.find({
      $or: [{ owner: userId }, { collaborators: userId }],
    })
      .sort({ updatedAt: -1 })
      .populate(playlistPopulate);

    return res.status(200).json({
      playlists: playlists.map((playlist) => mapPlaylist(playlist, userId)),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
};