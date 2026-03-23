export const getTrack = (req, res) => {
  res.send("GET TRACK DETAILS");
};

import TrackModel from "../models/track.model.js";

export const uploadTrack = async (req, res) => {
  try {
    const {
      title,
      audioUrl,
      genres,
      language,
      isExplicit,
      album
    } = req.body;

    const artistId = req.user?.id;

    if (!artistId) {
      return res.status(401).json({
        message: "Unauthorized - Artist not found",
      });
    }


    if (!title || !audioUrl || !duration) {
      return res.status(400).json({
        message: "Title, audioUrl and duration are required",
      });
    }


    const newTrack = await TrackModel.create({
      title,
      duration,
      audioUrl,
      coverImage,
      artists: [artistId],
      primaryArtist: artistId,
      album,
      genres,
      language,
      isExplicit,
    });

    return res.status(201).json({
      message: "Track uploaded successfully",
      track: newTrack,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error Uploading Track",
      error: error.message,
    });
  }
};

export const updateTrack = (req, res) => {
  res.send("UPDATE TRACK");
};

export const deleteTrack = (req, res) => {
  res.send("DELETE TRACK");
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

