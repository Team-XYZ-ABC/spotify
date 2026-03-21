import mongoose from "mongoose";

const albumSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Album title is required"],
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      maxlength: 500,
      default: "",
    },

    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    coverImage: {
      type: String,
      default: "",
    },

    releaseDate: {
      type: Date,
      default: Date.now,
    },

    type: {
      type: String,
      enum: ["single", "album", "ep"],
      default: "album",
    },

    tracks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Track",
      },
    ],

    totalTracks: {
      type: Number,
      default: 0,
    },

    totalDuration: {
      type: Number, 
      default: 0,
    },

    genres: [
      {
        type: String,
      },
    ],

    isPublic: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    likesCount: {
      type: Number,
      default: 0,
    },

    playCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

albumSchema.index({ artist: 1 });
albumSchema.index({ artist: 1, createdAt: -1 });
albumSchema.index({ title: "text" });
albumSchema.index({ isPublic: 1 });
albumSchema.index(
  { artist: 1 },
  { partialFilterExpression: { isDeleted: false } }
);

const albumModel = mongoose.model("Album", albumSchema);

export default albumModel;