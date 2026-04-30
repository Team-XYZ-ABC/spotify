import mongoose from "mongoose";

const artistSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        stageName: { type: String, trim: true },
        genres: [{ type: String }],
        languages: [{ type: String }],
        coverImage: { type: String, default: "" },
        verified: { type: Boolean, default: false },
        socialLinks: {
            instagram: String,
            twitter: String,
            youtube: String,
            website: String,
        },
        followersCount: { type: Number, default: 0 },
        monthlyListeners: { type: Number, default: 0 },
        totalPlays: { type: Number, default: 0 },
        totalTracks: { type: Number, default: 0 },
        totalAlbums: { type: Number, default: 0 },
        label: { type: String, default: "" },
        copyrightOwner: { type: String, default: "" },
        isActive: { type: Boolean, default: true },
        slug: { type: String, unique: true, sparse: true },
    },
    { timestamps: true }
);

artistSchema.index({ stageName: "text", genres: "text" });
artistSchema.index({ verified: 1, followersCount: -1 });
artistSchema.index({ isActive: 1 });
artistSchema.index({ stageName: 1 });

const ArtistModel = mongoose.model("Artist", artistSchema);
export default ArtistModel;
