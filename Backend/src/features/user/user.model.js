import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        displayName: { type: String, required: true, trim: true },
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
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, "Invalid email"],
        },
        password: { type: String, required: true, select: false },
        avatar: { type: String, default: null },
        avatarKey: { type: String, default: null },
        bio: { type: String, default: "" },
        country: String,
        birthDate: Date,
        role: { type: String, enum: ["listener", "artist", "admin"], default: "listener" },
        isVerified: { type: Boolean, default: false },
        refreshToken: { type: String, select: false },
        lastLogin: Date,
        isActive: { type: Boolean, default: true },
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
        followersCount: { type: Number, default: 0 },
        followingCount: { type: Number, default: 0 },
        totalListeningTime: { type: Number, default: 0 },
        totalTracksPlayed: { type: Number, default: 0 },
        preferences: {
            language: { type: String, default: "en" },
            explicitContent: { type: Boolean, default: true },
            autoplay: { type: Boolean, default: true },
            audioQuality: {
                type: String,
                enum: ["low", "normal", "high", "very_high"],
                default: "high",
            },
        },
        likedTracks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tracks" }],
        followedArtists: [{ type: mongoose.Schema.Types.ObjectId, ref: "Artists" }],
        playbackState: {
            currentTrack: { type: mongoose.Schema.Types.ObjectId, ref: "Tracks", default: null },
            isPlaying: { type: Boolean, default: false },
            progress: { type: Number, default: 0 },
            volume: { type: Number, default: 1, min: 0, max: 1 },
            queue: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tracks" }],
            lastPlayedAt: { type: Date, default: null },
        },
    },
    { timestamps: true }
);

userSchema.index({ likedTracks: 1 });
userSchema.index({ followedArtists: 1 });

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
