import mongoose from "mongoose";

const playlistTrackSchema = new mongoose.Schema(
    {
        track: { type: mongoose.Schema.Types.ObjectId, ref: "Tracks", required: true },
        addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        addedAt: { type: Date, default: Date.now },
    },
    { _id: false }
);

const playlistSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Playlist name is required"],
            trim: true,
            maxlength: 120,
        },
        description: { type: String, trim: true, maxlength: 500, default: "" },
        coverImage: { type: String, default: "" },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        tracks: [playlistTrackSchema],
        isPublic: { type: Boolean, default: true },
    },
    { timestamps: true }
);

playlistSchema.index({ owner: 1, updatedAt: -1 });
playlistSchema.index({ collaborators: 1, updatedAt: -1 });
playlistSchema.index({ name: "text", description: "text" });

const PlaylistModel = mongoose.model("Playlist", playlistSchema);
export default PlaylistModel;
