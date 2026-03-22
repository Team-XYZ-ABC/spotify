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
            lowercase: true,
            trim: true,
            minlength: 3,
            maxlength: 20,
            match: [/^[a-z0-9_]+$/, "Invalid username"]
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, "Invalid email"]
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

        country: String,

        birthDate: Date,

        role: {
            type: String,
            enum: ["listener", "artist", "admin"],
            default: "listener"
        },

        isVerified: {
            type: Boolean,
            default: false
        },

        refreshToken: {
            type: String,
            select: false // 🔐 important
        },

        lastLogin: Date,

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
        }

    },
    {
        timestamps: true
    }
);

const UserModel = mongoose.model("User", userSchema);

export default UserModel;