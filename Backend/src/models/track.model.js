import mongoose from "mongoose";

const trackSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            index: true
        },

        duration: {
            type: Number,
            required: true
        },

        audioUrl: {
            type: String,
            required: true
        },

        coverImage: {
            type: String
        },

        artists: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Artists",
                required: true
            }
        ],

        primaryArtist: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Artists",
            required: true
        },

        album: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Album"
        },

        genres: [
            {
                type: String
            }
        ],

        lang: {
            type: String
        },

        isExplicit: {
            type: Boolean,
            default: false
        },

        playCount: {
            type: Number,
            default: 0
        },

        likeCount: {
            type: Number,
            default: 0
        },

        shareCount: {
            type: Number,
            default: 0
        },

        copyrightOwner: {
            type: String
        },

        isrc: {
            type: String,
            unique: true,
            sparse: true
        },

        availableCountries: [
            {
                type: String
            }
        ],

        isPublished: {
            type: Boolean,
            default: true
        },
        audioFileId: {
            type: String,
            required: true
        }

    },
    {
        timestamps: true
    }
);

trackSchema.index({ title: "text" });
trackSchema.index({ artists: 1 });
trackSchema.index({ album: 1 });

const TrackModel = mongoose.model("Tracks", trackSchema);

export default TrackModel