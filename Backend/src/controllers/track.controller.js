import { uploadSong } from "../services/imagekit.service.js";
import TrackModel from "../models/track.model.js";
import { generateISRC } from "../utils.js";
import imagekit from "../configs/imagekit.config.js";
import ArtistModel from "../models/artist.model.js";
import albumModel from "../models/album.model.js";



export const getTrack = async (req, res) => {
  try {
    const { trackId } = req.params;

    if (!trackId) {
      return res.status(400).json({
        message: "Track ID is required",
      });
    }

    const track = await TrackModel.findById(trackId)
      .populate("primaryArtist", "name")
      .populate("artists", "name")
      .populate("album", "title");

    if (!track) {
      return res.status(404).json({
        message: "Track not found",
      });
    }

    res.status(200).json({
      message: "Track fetched successfully",
      data: track,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const streamTrack = (req, res) => {
  res.send("STREAM TRACK");
};

export const likeTrack = (req, res) => {
  res.send("LIKE TRACK");
};

export const unlikeTrack = (req, res) => {
  res.send("UNLIKE TRACK");
};

export const getTrackLyrics = (req, res) => {
  res.send("GET TRACK LYRICS");
};

export const getTrackCredits = (req, res) => {
  res.send("GET TRACK CREDITS");
};

export const getTrackRecommendations = (req, res) => {
  res.send("GET TRACK RECOMMENDATIONS");
};


export const uploadTrack = async (req, res) => {
  try {
    const file = req.file;

    const {
      title,
      artists,
      album,
      genres,
      lang,
      isExplicit,
      copyrightOwner,
      isrc,
      availableCountries,
      coverImage,
      audioFileId
    } = req.body;

    const primaryArtist = req.user.id;

    if (!file) {
      return res.status(400).json({ message: "No file provided" });
    }

    if (!title) {
      return res.status(400).json({
        message: "title is required",
      });
    }

    const result = await uploadSong(
      file.buffer,
      file.originalname,
      "uploads/track"
    );

    const track = await TrackModel.create({
      title,
      duration: result.duration,
      audioUrl: result.url,

      primaryArtist,
      artists: artists ? JSON.parse(artists) : [primaryArtist],

      album: album || null,
      genres: genres ? JSON.parse(genres) : [],
      lang: lang || null,

      isExplicit: isExplicit === "true",

      audioFileId: result.fileId,

      copyrightOwner: copyrightOwner || null,
      isrc: isrc || generateISRC(),

      availableCountries: availableCountries
        ? JSON.parse(availableCountries)
        : [],

      coverImage: coverImage || null,
    });

    res.status(201).json({
      message: "Track uploaded successfully",
      data: track,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


export const updateTrack = async (req, res) => {
  try {
    const { trackId } = req.params;

    const {
      title,
      artists,
      album,
      genres,
      lang,
      isExplicit,
      copyrightOwner,
      isrc,
      availableCountries,
      coverImage
    } = req.body;

    const userId = req.user.id;

    const track = await TrackModel.findById(trackId);

    if (!track) {
      return res.status(404).json({ message: "Track not found" });
    }

    if (track.primaryArtist.toString() !== userId) {
      return res.status(403).json({
        message: "You can only update your own track",
      });
    }

    const updateData = {};

    if (title) updateData.title = title;

    if (artists) updateData.artists = JSON.parse(artists);

    if (album) updateData.album = album;

    if (genres) updateData.genres = JSON.parse(genres);

    if (lang) updateData.lang = lang;

    if (isExplicit !== undefined)
      updateData.isExplicit = isExplicit === "true";

    if (copyrightOwner) updateData.copyrightOwner = copyrightOwner;

    if (isrc) updateData.isrc = isrc;

    if (availableCountries)
      updateData.availableCountries = JSON.parse(availableCountries);

    if (coverImage) updateData.coverImage = coverImage;

    const updatedTrack = await TrackModel.findByIdAndUpdate(
      trackId,
      updateData,
      { new: true }
    );

    res.status(200).json({
      message: "Track updated successfully",
      data: updatedTrack,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


export const deleteTrack = async (req, res) => {
  try {
    const { trackId } = req.params;
    const userId = req.user.id;

    const track = await TrackModel.findById(trackId);

    if (!track) {
      return res.status(404).json({ message: "Track not found" });
    }

    if (track.primaryArtist.toString() !== userId) {
      return res.status(403).json({
        message: "You can delete only your own track",
      });
    }

    if (track.audioFileId) {
      try {
        await imagekit.files.deleteFile(track.audioFileId);
        console.log("ImageKit file deleted");
      } catch (err) {
        console.log("ImageKit delete failed:", err.message);
      }
    }

    await TrackModel.findByIdAndDelete(trackId);

    res.status(200).json({
      message: "Track deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
