import mongoose from "mongoose";

/**
 * @typedef {"listener" | "artist" | "admin"} UserRole
 * @typedef {"free" | "premium" | "family" | "student"} SubscriptionType
 * @typedef {"low" | "normal" | "high" | "very_high"} AudioQuality
 */

/**
 * @typedef {Object} Subscription
 * @property {SubscriptionType} type - Subscription plan type
 * @property {Date} startDate - Subscription start date
 * @property {Date} expiryDate - Expiry date
 * @property {string} paymentProvider - Payment provider (e.g., Stripe, Razorpay)
 */

/**
 * @typedef {Object} Preferences
 * @property {string} language - Preferred language
 * @property {boolean} explicitContent - Allow explicit content
 * @property {boolean} autoplay - Autoplay next track
 * @property {AudioQuality} audioQuality - Preferred audio quality
 */

/**
 * @typedef {Object} PlaybackState
 * @property {mongoose.Types.ObjectId|null} currentTrack - Currently playing track
 * @property {boolean} isPlaying - Playback status
 * @property {number} progress - Current playback position (seconds)
 * @property {number} volume - Volume level (0–1)
 * @property {mongoose.Types.ObjectId[]} queue - Upcoming tracks
 * @property {Date|null} lastPlayedAt - Last playback timestamp
 */

/**
 * @typedef {Object} User
 * @property {string} displayName - Display name
 * @property {string} username - Unique username
 * @property {string} email - Email address
 * @property {string} password - Hashed password (not selected by default)
 * @property {string|null} avatar - Profile image
 * @property {string} bio - User bio
 * @property {string} country - Country code/name
 * @property {Date} birthDate - Date of birth
 * @property {UserRole} role - User role
 * @property {boolean} isVerified - Email/identity verification status
 * @property {string} refreshToken - Auth refresh token (hidden)
 * @property {Date} lastLogin - Last login timestamp
 * @property {boolean} isActive - Account status
 * @property {Subscription} subscription - Subscription details
 * @property {number} followersCount - Followers count (denormalized)
 * @property {number} followingCount - Following count (denormalized)
 * @property {number} totalListeningTime - Total listening time in seconds
 * @property {number} totalTracksPlayed - Total tracks played
 * @property {Preferences} preferences - User preferences
 * @property {mongoose.Types.ObjectId[]} likedTracks - Liked tracks
 * @property {mongoose.Types.ObjectId[]} followedArtists - Followed artists
 * @property {PlaybackState} playbackState - Current playback state
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */


/**
 * User Schema
 * -----------------------------------------------------
 * Represents a platform user (listener, artist, or admin).
 * Combines authentication, preferences, social data, and playback state.
 */
const userSchema = new mongoose.Schema(
    {
        // Public display name shown across the platform
        displayName: {
            type: String,
            required: true,
            trim: true,
        },

        // Unique username (used for profile URLs and mentions)
        username: {
            type: String,
            unique: true,
            sparse: true,
            lowercase: true,
            trim: true,
            minlength: 3,
            maxlength: 20,
            match: [/^[a-z0-9_]+$/, "Invalid username"],
        },

        // Email used for authentication
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, "Invalid email"],
        },

        // Hashed password (excluded from queries by default)
        password: {
            type: String,
            required: true,
            select: false,
        },

        // Profile image URL
        avatar: {
            type: String,
            default: null,
        },

        // S3 key for avatar (used to generate presigned GET URLs)
        avatarKey: {
            type: String,
            default: null,
        },

        // Short bio/about section
        bio: {
            type: String,
            default: "",
        },

        // User location
        country: String,

        // Date of birth
        birthDate: Date,

        // Role-based access control
        role: {
            type: String,
            enum: ["listener", "artist", "admin"],
            default: "listener",
        },

        // Verification status (email or identity)
        isVerified: {
            type: Boolean,
            default: false,
        },

        // Refresh token for authentication (hidden)
        refreshToken: {
            type: String,
            select: false,
        },

        // Last login timestamp
        lastLogin: Date,

        // Account active/disabled flag
        isActive: {
            type: Boolean,
            default: true,
        },

        // Subscription details
        subscription: {
            type: {
                type: String,
                enum: ["free", "premium", "family", "student"],
                default: "free",
            },
            startDate: Date,
            expiryDate: Date,
            paymentProvider: String,
        },

        // Denormalized social counters
        followersCount: {
            type: Number,
            default: 0,
        },

        followingCount: {
            type: Number,
            default: 0,
        },

        // Listening analytics
        totalListeningTime: {
            type: Number,
            default: 0,
        },

        totalTracksPlayed: {
            type: Number,
            default: 0,
        },

        // User preferences
        preferences: {
            language: {
                type: String,
                default: "en",
            },
            explicitContent: {
                type: Boolean,
                default: true,
            },
            autoplay: {
                type: Boolean,
                default: true,
            },
            audioQuality: {
                type: String,
                enum: ["low", "normal", "high", "very_high"],
                default: "high",
            },
        },

        // Tracks liked by the user
        likedTracks: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Tracks",
            },
        ],

        // Artists followed by the user
        followedArtists: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Artists",
            },
        ],

        // Playback state (used for resume, sync across devices)
        playbackState: {
            currentTrack: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Tracks",
                default: null,
            },
            isPlaying: {
                type: Boolean,
                default: false,
            },
            progress: {
                type: Number,
                default: 0,
            },
            volume: {
                type: Number,
                default: 1,
                min: 0,
                max: 1,
            },
            queue: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Tracks",
                },
            ],
            lastPlayedAt: {
                type: Date,
                default: null,
            },
        },
    },
    {
        timestamps: true,
    }
);


/**
 * INDEXES
 * -----------------------------------------------------
 * Designed for social and interaction-based queries.
 */

// Fast lookup for users who liked a specific track
userSchema.index({ likedTracks: 1 });

// Fast lookup for users following a specific artist
userSchema.index({ followedArtists: 1 });


/**
 * MODEL EXPORT
 */
const UserModel = mongoose.model("User", userSchema);

export default UserModel;