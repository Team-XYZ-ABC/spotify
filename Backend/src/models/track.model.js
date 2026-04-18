import mongoose from "mongoose";

/**
 * @typedef {Object} Track
 * @property {string} title - Track title
 * @property {number} duration - Duration in seconds
 * @property {string} audioUrl - Public URL for audio streaming
 * @property {string} coverImage - Cover image URL
 * @property {mongoose.Types.ObjectId[]} artists - List of contributing artists
 * @property {mongoose.Types.ObjectId} primaryArtist - Main artist of the track
 * @property {mongoose.Types.ObjectId} album - Associated album (if any)
 * @property {string[]} genres - Genres associated with the track
 * @property {string} lang - Language of the track
 * @property {boolean} isExplicit - Explicit content flag
 * @property {number} playCount - Total play count (denormalized)
 * @property {number} likeCount - Total likes (denormalized)
 * @property {number} shareCount - Total shares (denormalized)
 * @property {string} copyrightOwner - Copyright ownership info
 * @property {string} isrc - International Standard Recording Code
 * @property {string[]} availableCountries - Countries where track is available
 * @property {boolean} isPublished - Visibility/publish status
 * @property {string} audioFileId - Internal storage reference (e.g., S3 key)
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */


/**
 * Track Schema
 * -----------------------------------------------------
 * Represents a single audio track in the system.
 * Designed for high-read workloads (streaming, search, discovery)
 * using denormalized counters and optimized indexing.
 */
const trackSchema = new mongoose.Schema(
    {
        // Track title used for display and search
        title: {
            type: String,
            required: true,
            trim: true,
            index: true, // supports fast exact match queries
        },

        // Duration of track in seconds
        duration: {
            type: Number,
            required: true,
        },

        // Public URL used for streaming (CDN or direct storage)
        audioUrl: {
            type: String,
            required: true,
        },

        // Cover image for UI display
        coverImage: {
            type: String,
        },

        // List of all contributing artists (features, collaborations)
        artists: [
            {
                // type: mongoose.Schema.Types.ObjectId,
                // ref: "Artist",
                type: String,
                required: true
            },
        ],

        // Primary/main artist (used for ownership & filtering)
        primaryArtist: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Artist",
            required: true,
        },

        // Associated album (optional)
        album: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Album",
        },

        // Genres for filtering and recommendations
        genres: [
            {
                type: String,
            },
        ],

        // Language of the track (e.g., Hindi, English)
        lang: {
            type: String,
        },

        // Explicit content flag (parental control)
        isExplicit: {
            type: Boolean,
            default: false,
        },

        // Denormalized counters for performance (high-read systems)
        playCount: {
            type: Number,
            default: 0,
        },

        likeCount: {
            type: Number,
            default: 0,
        },

        shareCount: {
            type: Number,
            default: 0,
        },

        // Copyright ownership metadata
        copyrightOwner: {
            type: String,
        },

        // Global unique track identifier (industry standard)
        isrc: {
            type: String,
            unique: true,
            sparse: true, // allows null values while keeping uniqueness
        },

        // Geo-restriction (where the track is available)
        availableCountries: [
            {
                type: String,
            },
        ],

        // Publishing status (draft vs live)
        isPublished: {
            type: Boolean,
            default: true,
        },

        // Internal storage reference (e.g., S3 object key)
        audioFileId: {
            type: String,
            required: true,
        },
    },
    {
        // Automatically manages createdAt & updatedAt
        timestamps: true,
    }
);


/**
 * INDEXES
 * -----------------------------------------------------
 * Designed based on real-world access patterns.
 */

// Full-text search (title + genres)
// Example: search "romantic hindi song"
trackSchema.index({ title: "text", genres: "text" });

// Fetch tracks by primary artist with publish filter
trackSchema.index({ primaryArtist: 1, isPublished: 1 });

// Fetch album tracks efficiently
trackSchema.index({ album: 1, isPublished: 1 });

// Recent uploads / feed (latest tracks)
trackSchema.index({ createdAt: -1, isPublished: 1 });

// Popular tracks (sorted by play count)
trackSchema.index({ playCount: -1, isPublished: 1 });

// Tracks by any contributing artist
trackSchema.index({ artists: 1, isPublished: 1 });

// Alternate index for recent published tracks
trackSchema.index({ isPublished: 1, createdAt: -1 });


/**
 * MODEL EXPORT
 */
const TrackModel = mongoose.model("Tracks", trackSchema);

export default TrackModel;