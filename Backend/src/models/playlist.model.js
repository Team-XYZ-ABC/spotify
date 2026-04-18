import mongoose from "mongoose";

/**
 * @typedef {Object} PlaylistTrack
 * @property {mongoose.Types.ObjectId} track - Reference to the track document
 * @property {mongoose.Types.ObjectId} addedBy - User who added the track
 * @property {Date} addedAt - Timestamp when the track was added
 */

/**
 * PlaylistTrack Schema
 * ----------------------------------------
 * Represents a single track entry inside a playlist.
 * Includes metadata about who added the track and when.
 */
const playlistTrackSchema = new mongoose.Schema(
    {
        track: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tracks",
            required: true,
        },

        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        addedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        _id: false, // Avoid creating extra ObjectId for each track entry
    }
);


/**
 * @typedef {Object} Playlist
 * @property {string} name - Name of the playlist
 * @property {string} description - Description of the playlist
 * @property {string} coverImage - Cover image URL
 * @property {mongoose.Types.ObjectId} owner - Owner (creator) of playlist
 * @property {mongoose.Types.ObjectId[]} collaborators - Users who can edit playlist
 * @property {PlaylistTrack[]} tracks - List of tracks with metadata
 * @property {boolean} isPublic - Visibility of the playlist
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */


/**
 * Playlist Schema
 * ----------------------------------------
 * Represents a user-created playlist.
 * Supports ownership, collaboration, track ordering, and search.
 */
const playlistSchema = new mongoose.Schema(
    {
        // Playlist title displayed in UI
        name: {
            type: String,
            required: [true, "Playlist name is required"],
            trim: true,
            maxlength: 120,
        },

        // Optional description for additional context
        description: {
            type: String,
            trim: true,
            maxlength: 500,
            default: "",
        },

        // Playlist cover image (custom or auto-generated)
        coverImage: {
            type: String,
            default: "",
        },

        // Owner (creator) of the playlist
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        // Users who can collaborate and modify this playlist
        collaborators: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],

        // Ordered list of tracks with metadata (addedBy, addedAt)
        tracks: [playlistTrackSchema],

        // Visibility control (true = public, false = private)
        isPublic: {
            type: Boolean,
            default: true,
        },
    },
    {
        // Automatically adds createdAt & updatedAt fields
        timestamps: true,
    }
);


/**
 * INDEXES
 * ----------------------------------------
 * Defined based on common query patterns.
 */

// Fetch playlists owned by a user sorted by recent activity
playlistSchema.index({ owner: 1, updatedAt: -1 });

// Fetch playlists where user is a collaborator
playlistSchema.index({ collaborators: 1, updatedAt: -1 });

// Enable full-text search on playlist name and description
playlistSchema.index({ name: "text", description: "text" });


const PlaylistModel = mongoose.model("Playlist", playlistSchema);

export default PlaylistModel;