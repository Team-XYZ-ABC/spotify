import mongoose from "mongoose";
import PlaylistModel from "../models/playlist.model.js";
import TrackModel from "../models/track.model.js";
import UserModel from "../models/user.model.js";

const MAX_COLLABORATORS = 10;

/**
 * Format duration from seconds to "m:ss"
 *
 * - Ensures input is a valid non-negative number
 * - Floors decimal values
 * - Pads seconds to always show 2 digits
 *
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration (e.g., "3:05")
 */
const formatDuration = (seconds = 0) => {
  // normalize input (handle invalid / negative / decimal values)
  const safeSeconds = Number.isFinite(seconds)
    ? Math.max(0, Math.floor(seconds))
    : 0;

  const minutes = Math.floor(safeSeconds / 60);
  const remain = safeSeconds % 60;

  return `${minutes}:${String(remain).padStart(2, "0")}`;
};



/**
 * Transform a playlist track entry into a frontend-friendly track object
 *
 * Responsibilities:
 * - Extract track data from playlist wrapper
 * - Normalize artist names (primary + featured)
 * - Format duration for UI
 * - Provide safe fallback values
 *
 * @param {Object} playlistTrack - Playlist track wrapper (contains track + metadata)
 * @param {Object} playlistTrack.track - Actual track document (may be populated)
 *
 * @returns {Object|null} Formatted track object or null if invalid
 */
const mapTrack = (playlistTrack) => {
  const trackDoc = playlistTrack?.track;

  // guard: invalid or missing track
  if (!trackDoc || typeof trackDoc !== "object") {
    return null;
  }

  // primary artist (fallback if missing)
  const mainArtist =
    trackDoc.primaryArtist?.stageName || "Unknown artist";

  // extract featured artists (excluding primary artist)
  const featuredArtists = Array.isArray(trackDoc.artists)
    ? trackDoc.artists
      .map((artist) => artist?.stageName)
      .filter(Boolean)
      .filter((name) => name !== mainArtist)
    : [];

  return {
    id: trackDoc._id,
    title: trackDoc.title,

    // combine artists into single string
    artist: [mainArtist, ...featuredArtists].join(", "),

    album: trackDoc.album?.title || "Single",

    // formatted duration (mm:ss)
    duration: formatDuration(trackDoc.duration),

    // raw duration (used for calculations)
    durationSeconds: trackDoc.duration,

    image: trackDoc.coverImage || "",

    // playlist-specific metadata
    addedAt: playlistTrack.addedAt,
    addedBy: playlistTrack.addedBy,
  };
};




/**
 * Transform a user document into a safe, frontend-friendly object
 *
 * - Picks only required public fields
 * - Avoids exposing sensitive data (e.g., password, tokens)
 * - Ensures consistent response shape
 *
 * @param {Object} userDoc - Raw user document (may be populated or partial)
 * @returns {Object} Normalized user object
 */
const mapUser = (userDoc) => ({
  id: userDoc?._id,
  username: userDoc?.username,
  email: userDoc?.email,
  displayName: userDoc?.displayName,
  avatar: userDoc?.avatar || "",
});




/**
 * Transform a playlist document into a frontend-friendly object
 *
 * Responsibilities:
 * - Normalize playlist data
 * - Transform nested relations (tracks, users)
 * - Calculate derived values (song count, total duration)
 * - Attach user-specific permissions
 *
 * @param {Object} playlistDoc - Raw playlist document from MongoDB (may be populated)
 * @param {string|ObjectId} currentUserId - ID of the current authenticated user
 *
 * @returns {Object} Formatted playlist object
 */
const mapPlaylist = (playlistDoc, currentUserId) => {
  // transform tracks and remove invalid entries
  const tracks = (playlistDoc.tracks || [])
    .map(mapTrack)
    .filter(Boolean);

  // calculate total duration in seconds
  const totalDurationSeconds = tracks.reduce(
    (sum, track) => sum + (track.durationSeconds || 0),
    0
  );

  // normalize owner and collaborator IDs for permission checks
  const ownerId = String(playlistDoc.owner?._id || playlistDoc.owner);
  const collaboratorIds = new Set(
    (playlistDoc.collaborators || []).map((user) =>
      String(user?._id || user)
    )
  );

  return {
    id: playlistDoc._id,
    name: playlistDoc.name,
    description: playlistDoc.description,
    coverImage: playlistDoc.coverImage,
    isPublic: playlistDoc.isPublic,

    // map user-related fields
    owner: playlistDoc.owner ? mapUser(playlistDoc.owner) : null,
    collaborators: (playlistDoc.collaborators || []).map(mapUser),

    // derived values
    songCount: tracks.length,
    totalDurationSeconds,
    tracks,

    // access control flags for frontend
    permissions: {
      isOwner: ownerId === String(currentUserId),
      isCollaborator: collaboratorIds.has(String(currentUserId)),
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



/**
 * Normalize collaborator IDs
 * - Ensures array input
 * - Converts values to trimmed strings
 * - Removes empty values
 * - Removes duplicates
 */
const parseCollaboratorIds = (collaboratorIds) => {
  if (!collaboratorIds) return [];

  if (!Array.isArray(collaboratorIds)) return null;

  const filtered = collaboratorIds
    .map((id) => String(id ?? "").trim()) // safer than ||
    .filter(Boolean);

  return [...new Set(filtered)];
};


/**
 * Create a new playlist
 *
 * Flow:
 * 1. Validate playlist name
 * 2. Parse & clean collaborator IDs (remove invalid / duplicates)
 * 3. Exclude owner from collaborators
 * 4. Enforce max collaborators limit
 * 5. Validate collaborators exist in DB
 * 6. Create playlist
 * 7. Populate related fields and return formatted response
 *
 * Access: Authenticated user
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const createPlaylist = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      name,
      description = "",
      coverImage = "",
      collaboratorIds = [],
    } = req.body;

    // validate playlist name
    if (!name?.trim()) {
      return res.status(400).json({
        message: "Playlist name is required",
      });
    }

    // sanitize collaborator IDs (array, trim, remove duplicates)
    const parsedCollaboratorIds = parseCollaboratorIds(collaboratorIds);

    if (parsedCollaboratorIds === null) {
      return res.status(400).json({
        message: "collaboratorIds must be an array of user IDs",
      });
    }

    // remove owner from collaborators
    const collaborators = parsedCollaboratorIds.filter(
      (id) => id !== String(userId)
    );

    // enforce max collaborators limit
    if (collaborators.length > MAX_COLLABORATORS) {
      return res.status(400).json({
        message: `Maximum ${MAX_COLLABORATORS} collaborators are allowed`,
      });
    }

    // validate users exist in DB
    if (collaborators.length) {
      const count = await UserModel.countDocuments({
        _id: { $in: collaborators },
      });

      if (count !== collaborators.length) {
        return res.status(400).json({
          message: "One or more collaborators are invalid",
        });
      }
    }

    // create playlist
    const playlist = await PlaylistModel.create({
      name: name.trim(),
      description: description.trim(),
      coverImage,
      owner: userId,
      collaborators,
    });

    // fetch with populated fields
    const saved = await PlaylistModel.findById(playlist._id)
      .populate(playlistPopulate);

    return res.status(201).json({
      message: "Playlist created successfully",
      playlist: mapPlaylist(saved, userId),
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message || "Server error",
    });
  }
};



/**
 * Fetch a single playlist with access control
 *
 * Flow:
 * 1. Fetch playlist by ID with populated relations
 * 2. Check if playlist exists
 * 3. Determine user role (owner / collaborator)
 * 4. Restrict access if playlist is private
 * 5. Return formatted playlist data
 *
 * Access Rules:
 * - Public playlist → anyone can view
 * - Private playlist → only owner or collaborators
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getPlaylist = async (req, res) => {
  try {
    const playlist = await PlaylistModel.findById(req.params.playlistId)
      .populate(playlistPopulate);

    if (!playlist) {
      return res.status(404).json({
        message: "Playlist not found",
      });
    }

    const userId = String(req.user.id);

    // check ownership
    const isOwner = String(playlist.owner?._id) === userId;

    // check collaborator access
    const isCollaborator = (playlist.collaborators || []).some(
      (user) => String(user?._id) === userId
    );

    // restrict private playlist access
    if (!playlist.isPublic && !isOwner && !isCollaborator) {
      return res.status(403).json({
        message: "You cannot view this playlist",
      });
    }

    return res.status(200).json({
      message: "Playlist fetched successfully",
      playlist: mapPlaylist(playlist, req.user.id),
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message || "Server error",
    });
  }
};



/**
 * Update playlist details (partial update)
 *
 * Flow:
 * 1. Validate input (name should not be empty if provided)
 * 2. Build update object dynamically
 * 3. Update playlist in DB
 * 4. Return updated playlist with populated data
 *
 * Notes:
 * - Only provided fields are updated (PATCH behavior)
 * - Access control (owner only) handled via middleware
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const updatePlaylist = async (req, res) => {
  try {
    const { name, description, coverImage, isPublic } = req.body;

    // validate name if provided
    if (name !== undefined && !String(name).trim()) {
      return res.status(400).json({
        message: "Playlist name cannot be empty",
      });
    }

    // build dynamic update object
    const updateData = {};

    if (name !== undefined) {
      updateData.name = String(name).trim();
    }

    if (description !== undefined) {
      updateData.description = String(description).trim();
    }

    if (coverImage !== undefined) {
      updateData.coverImage = coverImage;
    }

    if (isPublic !== undefined) {
      updateData.isPublic = Boolean(isPublic);
    }

    const updated = await PlaylistModel.findByIdAndUpdate(
      req.params.playlistId,
      updateData,
      { new: true }
    ).populate(playlistPopulate);

    return res.status(200).json({
      message: "Playlist updated successfully",
      playlist: mapPlaylist(updated, req.user.id),
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message || "Server error",
    });
  }
};



/**
 * Delete a playlist by ID
 *
 * Flow:
 * 1. Delete playlist from DB
 * 2. Return success response with deleted playlist ID
 *
 * Notes:
 * - Access control (owner only) handled via middleware
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const deletePlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;

    await PlaylistModel.findByIdAndDelete(playlistId);

    return res.status(200).json({
      message: "Playlist deleted successfully",
      playlistId,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message || "Server error",
    });
  }
};



/**
 * Add collaborators to a playlist
 * - Validates input IDs
 * - Excludes owner
 * - Ensures users exist
 * - Merges uniquely and enforces max limit
 */
export const addCollaborators = async (req, res) => {
  try {
    const { collaboratorIds = [] } = req.body;
    const playlist = req.playlist;
    const ownerId = String(playlist.owner);

    // sanitize + dedupe input
    const parsed = parseCollaboratorIds(collaboratorIds);
    if (!parsed?.length) {
      return res.status(400).json({
        message: "collaboratorIds must be a non-empty array",
      });
    }

    // exclude owner
    const requested = parsed.filter((id) => id !== ownerId);

    // validate users exist
    const validUsers = await UserModel.aggregate([
      {
        $match: {
          _id: {
            $in: requested.map(
              (id) => new mongoose.Types.ObjectId(id)
            ),
          },
        },
      },
      { $project: { _id: 1 } },
      
    ]);

    const validIds = validUsers.map((u) => String(u._id));

    if (validIds.length !== requested.length) {
      return res.status(400).json({
        message: "One or more collaborators are invalid",
      });
    }

    // merge collaborators (unique) + enforce max limit
    const updated = await PlaylistModel.findOneAndUpdate(
      { _id: playlist._id },
      [
        {
          $set: {
            collaborators: {
              $slice: [
                {
                  $setUnion: [
                    { $ifNull: ["$collaborators", []] },
                    validIds.map(
                      (id) => new mongoose.Types.ObjectId(id)
                    ),
                  ],
                },
                MAX_COLLABORATORS,
              ],
            },
          },
        },
      ],
      { new: true,
        updatePipeline: true
      }
      
    ).populate(playlistPopulate);

    return res.status(200).json({
      message: "Collaborators added successfully",
      playlist: mapPlaylist(updated, req.user.id),
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message || "Server error",
    });
  }
};



/**
 * Remove a collaborator from a playlist
 * Access: Owner only (handled via middleware)
 */
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



/**
 * Add a track to a playlist
 *
 * Access Control:
 * - Owner or collaborators can add tracks (handled via middleware)
 *
 * Business Rules:
 * - trackId is required
 * - Track must exist in DB
 * - Duplicate tracks are not allowed
 * - Maximum 100 tracks allowed per playlist
 *
 * Flow:
 * 1. Validate input
 * 2. Enforce track limit
 * 3. Check track existence
 * 4. Prevent duplicates
 * 5. Add track with metadata (addedBy, addedAt)
 * 6. Save and return updated playlist
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const addTrackToPlaylist = async (req, res) => {
  try {
    const { trackId } = req.body;
    const playlist = req.playlist;

    if (!trackId) {
      return res.status(400).json({
        message: "trackId is required",
      });
    }

    // enforce max track limit
    if ((playlist.tracks || []).length >= 100) {
      return res.status(400).json({
        message: "Maximum 100 tracks allowed in a playlist",
      });
    }

    const track = await TrackModel.findById(trackId).select("_id");

    if (!track) {
      return res.status(404).json({
        message: "Track not found",
      });
    }

    // prevent duplicate tracks
    const alreadyExists = (playlist.tracks || []).some(
      (t) => String(t.track) === String(trackId)
    );

    if (alreadyExists) {
      return res.status(400).json({
        message: "Track already exists in playlist",
      });
    }

    // add track with metadata
    playlist.tracks.push({
      track: track._id,
      addedBy: req.user.id,
      addedAt: new Date(),
    });

    await playlist.save();

    const updated = await PlaylistModel.findById(playlist._id)
      .populate(playlistPopulate);

    return res.status(200).json({
      message: "Track added to playlist",
      playlist: mapPlaylist(updated, req.user.id),
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message || "Server error",
    });
  }
};




/**
 * Remove a track from a playlist
 *
 * Access Control:
 * - Owner or collaborators can remove tracks (handled via middleware)
 *
 * Business Rules:
 * - Track must exist in playlist
 *
 * Flow:
 * 1. Get trackId from params
 * 2. Filter out the track from playlist
 * 3. If no change → track not found
 * 4. Save updated playlist
 * 5. Return updated playlist
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const removeTrackFromPlaylist = async (req, res) => {
  try {
    const { trackId } = req.params;
    const playlist = req.playlist;

    const beforeCount = playlist.tracks.length;

    // remove track from playlist
    playlist.tracks = playlist.tracks.filter(
      (t) => String(t.track) !== String(trackId)
    );

    // if no track removed → not found
    if (beforeCount === playlist.tracks.length) {
      return res.status(404).json({
        message: "Track not found in playlist",
      });
    }

    await playlist.save();

    const updated = await PlaylistModel.findById(playlist._id)
      .populate(playlistPopulate);

    return res.status(200).json({
      message: "Track removed from playlist",
      playlist: mapPlaylist(updated, req.user.id),
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message || "Server error",
    });
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



/**
 * Search users for collaborators using MongoDB Atlas Search
 *
 * Features:
 * - Autocomplete on username (fast typing search)
 * - Exact/normal search on email
 * - Fuzzy (typo-tolerant) search on displayName
 * - Excludes current user
 * - Returns top 10 relevant users (ranked)
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const searchUsersForCollaborators = async (req, res) => {
  try {
    const query = String(req.query.q || "").trim();

    if (!query) {
      return res.status(200).json({ users: [] });
    }

    const users = await UserModel.aggregate([
      {
        $search: {
          index: "user_search_by_displayname_username_email",
          compound: {
            should: [
              // Highest priority → username autocomplete
              {
                autocomplete: {
                  query,
                  path: "username",
                  score: { boost: { value: 5 } }
                }
              },

              // 🔹 Medium priority → email search
              {
                text: {
                  query,
                  path: "email",
                  score: { boost: { value: 3 } }
                }
              },

              // Flexible → displayName with typo tolerance
              {
                text: {
                  query,
                  path: "displayName",
                  fuzzy: { maxEdits: 2 },
                  score: { boost: { value: 2 } }
                }
              }
            ]
          }
        }
      },

      // exclude current user
      {
        $match: {
          _id: { $ne: req.user._id }
        }
      },

      // add relevance score (optional but useful)
      {
        $addFields: {
          score: { $meta: "searchScore" }
        }
      },

      // top results only
      { $limit: 10 },

      // return only required fields
      {
        $project: {
          _id: 1,
          username: 1,
          email: 1,
          displayName: 1,
          avatar: 1
        }
      }
    ]);

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
    return res.status(500).json({
      message: error.message || "Server error",
    });
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







/**
 * Fetch all playlists accessible to the current user
 *
 * Access Rules:
 * - User can see playlists where:
 *   1. They are the owner
 *   2. They are a collaborator
 *
 * Flow:
 * 1. Query playlists by owner or collaborator
 * 2. Sort by last updated (recent first)
 * 3. Populate related data (tracks, users)
 * 4. Map playlists to response format
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getUserPlaylists = async (req, res) => {
  try {
    const userId = req.user.id;

    const playlists = await PlaylistModel.find({
      $or: [
        { owner: userId },
        { collaborators: userId },
      ],
    })
      .sort({ updatedAt: -1 }) // latest first
      .populate(playlistPopulate);

    return res.status(200).json({
      playlists: playlists.map((playlist) =>
        mapPlaylist(playlist, userId)
      ),
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message || "Server error",
    });
  }
};