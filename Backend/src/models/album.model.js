import mongoose from "mongoose";

/**
 * @typedef {"single" | "album" | "ep"} AlbumType
 */

/**
 * @typedef {Object} Album
 * @property {string} title - Title of the album
 * @property {string} description - Short description
 * @property {mongoose.Types.ObjectId} artist - Reference to the owner (User)
 * @property {string} coverImage - Album cover image URL
 * @property {Date} releaseDate - Release date of the album
 * @property {AlbumType} type - Type of album (single, album, ep)
 * @property {mongoose.Types.ObjectId[]} tracks - List of track IDs
 * @property {number} totalTracks - Total number of tracks (denormalized)
 * @property {number} totalDuration - Total duration in seconds (denormalized)
 * @property {string[]} genres - Genres associated with the album
 * @property {boolean} isPublic - Visibility flag
 * @property {boolean} isDeleted - Soft delete flag
 * @property {number} likesCount - Total likes (denormalized)
 * @property {number} playCount - Total plays (denormalized)
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */


/**
 * Album Schema
 * -----------------------------------------------------
 * Represents a music album created by an artist.
 * Optimized for fast reads using denormalized fields
 * and query-driven indexing strategy.
 */
const albumSchema = new mongoose.Schema(
  {
    // Album title displayed in UI and search results
    title: {
      type: String,
      required: [true, "Album title is required"],
      trim: true,
      maxlength: 100,
    },

    // Optional description providing context about the album
    description: {
      type: String,
      maxlength: 500,
      default: "",
    },

    // Reference to the artist (User) who owns this album
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Cover image used in UI (thumbnail / artwork)
    coverImage: {
      type: String,
      default: "",
    },

    // Official release date of the album
    releaseDate: {
      type: Date,
      default: Date.now,
    },

    // Album category (single / album / EP)
    type: {
      type: String,
      enum: ["single", "album", "ep"],
      default: "album",
    },

    // Ordered list of tracks belonging to this album
    tracks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Track",
      },
    ],

    // Denormalized total number of tracks (avoids runtime counting)
    totalTracks: {
      type: Number,
      default: 0,
    },

    // Denormalized total duration (in seconds)
    totalDuration: {
      type: Number,
      default: 0,
    },

    // Genres associated with the album
    genres: [
      {
        type: String,
      },
    ],

    // Visibility control (true = public, false = private)
    isPublic: {
      type: Boolean,
      default: true,
    },

    // Soft delete flag (used instead of hard delete)
    isDeleted: {
      type: Boolean,
      default: false,
    },

    // Total number of likes (denormalized for performance)
    likesCount: {
      type: Number,
      default: 0,
    },

    // Total play count across all tracks in this album
    playCount: {
      type: Number,
      default: 0,
    },
  },
  {
    // Automatically maintains createdAt and updatedAt timestamps
    timestamps: true,
  }
);


/**
 * INDEXES
 * -----------------------------------------------------
 * Designed based on real-world query patterns.
 */

// Optimized for:
// - Fetching albums by artist
// - Filtering non-deleted albums
// - Sorting by latest release
// Example: find({ artist, isDeleted: false }).sort({ createdAt: -1 })
albumSchema.index({ artist: 1, isDeleted: 1, createdAt: -1 });


// Optimized for public album listings (explore/home page)
albumSchema.index({ isPublic: 1 });


// Enables full-text search on album title
// Example: search "love songs"
albumSchema.index({ title: "text" });


// Optional index for filtering albums by genre
// Example: find({ genres: "Pop" })
albumSchema.index({ genres: 1 });


/**
 * MODEL EXPORT
 */
const albumModel = mongoose.model("Album", albumSchema);

export default albumModel;