import mongoose from "mongoose";

const trackSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true, index: true },
        duration: { type: Number, required: true },
        audioUrl: { type: String, required: true },
        coverImage: { type: String },
        artists: [{ type: String, required: true }],
        primaryArtist: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Artist",
            required: true,
        },
        album: { type: mongoose.Schema.Types.ObjectId, ref: "Album" },
        genres: [{ type: String }],
        lang: { type: String },
        isExplicit: { type: Boolean, default: false },
        playCount: { type: Number, default: 0 },
        likeCount: { type: Number, default: 0 },
        shareCount: { type: Number, default: 0 },
        copyrightOwner: { type: String },
        isrc: { type: String, unique: true, sparse: true },
        availableCountries: [{ type: String }],
        isPublished: { type: Boolean, default: true },
        audioFileId: { type: String, required: true },
        coverImageKey: { type: String, default: null },
    },
    { timestamps: true }
);

trackSchema.index({ title: "text", genres: "text" });
trackSchema.index({ primaryArtist: 1, isPublished: 1 });
trackSchema.index({ album: 1, isPublished: 1 });
trackSchema.index({ createdAt: -1, isPublished: 1 });
trackSchema.index({ playCount: -1, isPublished: 1 });
trackSchema.index({ artists: 1, isPublished: 1 });
trackSchema.index({ isPublished: 1, createdAt: -1 });

const TrackModel = mongoose.model("Tracks", trackSchema);
export default TrackModel;
