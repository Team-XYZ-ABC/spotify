import mongoose from "mongoose";

const artistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
      unique: true,
      index: true
    },
    stageName: {
      type: String,
      required: true,
      trim: true,
      index: true
    },

    bio: {
      type: String,
      default: ""
    },

    avatar: {
      type: String
    },

    coverImage: {
      type: String
    },

    verified: {
      type: Boolean,
      default: false
    },

    genres: [
      {
        type: String
      }
    ],

    languages: [
      {
        type: String
      }
    ],

    socialLinks: {
      instagram: String,
      twitter: String,
      youtube: String,
      website: String
    },

    followersCount: {
      type: Number,
      default: 0
    },

    monthlyListeners: {
      type: Number,
      default: 0
    },

    totalPlays: {
      type: Number,
      default: 0
    },

    totalTracks: {
      type: Number,
      default: 0
    },

    totalAlbums: {
      type: Number,
      default: 0
    },

    label: {
      type: String
    },

    copyrightOwner: {
      type: String
    },

    isActive: {
      type: Boolean,
      default: true
    }

  },
  {
    timestamps: true
  }
);

export const ArtistModel = mongoose.model("Artists", artistSchema);