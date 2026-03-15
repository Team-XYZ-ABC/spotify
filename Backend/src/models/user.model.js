import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        // BASIC INFO
        displayName: {
            type: String,
            required: true,
            trim: true
        },

        username: {
            type: String,
            unique: true,
            sparse: true,
            index: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            index: true
        },

        password: {
            type: String,
            required: true
        },

        avatar: {
            type: String,
            default: null
        },

        bio: {
            type: String,
            default: ""
        },

        country: {
            type: String
        },

        birthDate: {
            type: Date
        },

        // ROLE SYSTEM
        role: {
            type: String,
            enum: ["listener", "artist", "admin"],
            default: "listener",
            index: true
        },

        isVerified: {
            type: Boolean,
            default: false
        },

        // AUTH SYSTEM
        refreshToken: {
            type: String
        },

        lastLogin: {
            type: Date
        },

        isActive: {
            type: Boolean,
            default: true
        },

        // SUBSCRIPTION (Spotify Premium type)
        subscription: {
            type: {
                type: String,
                enum: ["free", "premium", "family", "student"],
                default: "free"
            },

            startDate: Date,

            expiryDate: Date,

            paymentProvider: String
        },

        // FOLLOW SYSTEM
        followersCount: {
            type: Number,
            default: 0
        },

        followingCount: {
            type: Number,
            default: 0
        },

        // LISTENING STATS
        totalListeningTime: {
            type: Number,
            default: 0
        },

        totalTracksPlayed: {
            type: Number,
            default: 0
        },

        // USER PREFERENCES
        preferences: {
            language: {
                type: String,
                default: "en"
            },

            explicitContent: {
                type: Boolean,
                default: true
            },

            autoplay: {
                type: Boolean,
                default: true
            },

            audioQuality: {
                type: String,
                enum: ["low", "normal", "high", "very_high"],
                default: "high"
            }
        },

        // DEVICES (Spotify Connect type future feature)
        devices: [
            {
                deviceId: String,
                deviceName: String,
                deviceType: String,
                lastActive: Date
            }
        ],

        // SECURITY
        loginHistory: [
            {
                ip: String,
                device: String,
                location: String,
                loginAt: Date
            }
        ],

        // FEATURE FLAGS
        features: {
            betaUser: {
                type: Boolean,
                default: false
            }
        }

    },
    {
        timestamps: true
    }
);

export const UserModel = mongoose.model("Users", userSchema);
