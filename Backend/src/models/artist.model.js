import mongoose from "mongoose";

/**
 * @typedef {Object} SocialLinks
 * @property {string} [instagram] - Instagram profile URL
 * @property {string} [twitter] - Twitter/X profile URL
 * @property {string} [youtube] - YouTube channel URL
 * @property {string} [website] - Personal/official website
 */

/**
 * @typedef {Object} Artist
 * @property {mongoose.Types.ObjectId} user - Reference to the owner user
 * @property {string} stageName - Public display name of the artist
 * @property {string[]} genres - Music genres associated with the artist
 * @property {string[]} languages - Languages the artist performs in
 * @property {string} coverImage - Artist profile/cover image URL
 * @property {boolean} verified - Indicates verification status
 * @property {SocialLinks} socialLinks - Social media handles
 * @property {number} followersCount - Total followers (denormalized)
 * @property {number} monthlyListeners - Monthly listeners (approximate)
 * @property {number} totalPlays - Total play count across all tracks
 * @property {number} totalTracks - Total tracks published
 * @property {number} totalAlbums - Total albums released
 * @property {string} label - Record label name
 * @property {string} copyrightOwner - Copyright ownership info
 * @property {boolean} isActive - Whether profile is active
 * @property {string} slug - SEO-friendly unique identifier
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */


/**
 * Artist Schema
 * -----------------------------------------------------
 * Represents an artist profile linked to a user account.
 * Designed for fast reads using denormalized counters and indexed queries.
 */
const artistSchema = new mongoose.Schema(
  {
    // Reference to the user who owns this artist profile
    // Enforces 1:1 mapping between User and Artist
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // Public display name (used in UI, search, and URLs)
    stageName: {
      type: String,
      trim: true,
    },

    // Genres associated with the artist (used for filtering and search)
    genres: [
      {
        type: String,
      },
    ],

    // Languages in which the artist performs
    languages: [
      {
        type: String,
      },
    ],

    // Profile/cover image URL
    coverImage: {
      type: String,
      default: "",
    },

    // Verification status (e.g., blue tick)
    verified: {
      type: Boolean,
      default: false,
    },

    // Social media links grouped under a single object
    socialLinks: {
      instagram: String,
      twitter: String,
      youtube: String,
      website: String,
    },

    // Denormalized counters for performance optimization
    followersCount: {
      type: Number,
      default: 0,
    },

    monthlyListeners: {
      type: Number,
      default: 0,
    },

    totalPlays: {
      type: Number,
      default: 0,
    },

    totalTracks: {
      type: Number,
      default: 0,
    },

    totalAlbums: {
      type: Number,
      default: 0,
    },

    // Record label metadata
    label: {
      type: String,
      default: "",
    },

    // Copyright ownership details
    copyrightOwner: {
      type: String,
      default: "",
    },

    // Soft status flag for enabling/disabling profile
    isActive: {
      type: Boolean,
      default: true,
    },

    // SEO-friendly identifier for clean URLs
    slug: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null values for non-artist users
    },
  },
  {
    // Automatically maintains createdAt and updatedAt
    timestamps: true,
  }
);


/**
 * INDEXES
 * -----------------------------------------------------
 * Designed based on real-world query patterns.
 */

// Full-text search across stageName and genres
// Supports queries like: "romantic singer", "arijit"
artistSchema.index({ stageName: "text", genres: "text" });

// Optimized for fetching verified/trending artists sorted by popularity
// Example: find({ verified: true }).sort({ followersCount: -1 })
artistSchema.index({ verified: 1, followersCount: -1 });

// Efficient filtering of active artist profiles
artistSchema.index({ isActive: 1 });

// Optimized exact match lookup (non-text search)
// Example: find({ stageName: "Arijit Singh" })
artistSchema.index({ stageName: 1 });


/**
 * MODEL EXPORT
 */
const ArtistModel = mongoose.model("Artist", artistSchema);

export default ArtistModel;