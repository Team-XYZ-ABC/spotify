import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
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
            required: true,
            select: false
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
        followersCount: {
            type: Number,
            default: 0
        },

        followingCount: {
            type: Number,
            default: 0
        },

        totalListeningTime: {
            type: Number,
            default: 0
        },

        totalTracksPlayed: {
            type: Number,
            default: 0
        },

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

        devices: [
            {
                deviceId: String,
                deviceName: String,
                deviceType: String,
                lastActive: Date
            }
        ],

        loginHistory: [
            {
                ip: String,
                device: String,
                location: String,
                loginAt: Date
            }
        ],

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
