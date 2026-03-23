import { uploadSong } from "../services/imagekit.service.js";
import TrackModel from "../models/track.model.js";
import { generateISRC } from "../utils.js";



export const getTrack = (req, res) => {
  res.send("GET TRACK DETAILS");
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
      coverImage
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


export const updateTrack = (req, res) => {
  res.send("UPDATE TRACK");
};

export const deleteTrack = (req, res) => {
  res.send("DELETE TRACK");
};