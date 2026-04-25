import TrackModel from "../models/track.model.js";
import { generateISRC } from "../utils.js";
import { getCloudFrontSignedUrl, getCloudFrontUrl, deleteS3Object, getPresignedGetUrl, getS3KeyFromUrl } from "../services/s3.service.js";
import CONFIG from "../configs/env.config.js";
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
      .populate("artists", "name")
      .populate("album", "title");

    if (!track) {
      return res.status(404).json({
        message: "Track not found",
      });
    }

    const trackData = track.toObject();

    // Replace cover image with a fresh presigned GET URL
    const imageKey = trackData.coverImageKey || getS3KeyFromUrl(trackData.coverImage);
    if (imageKey) {
      trackData.coverImage = await getPresignedGetUrl(imageKey, 86400); // 24 hours
    }

    res.status(200).json({
      message: "Track fetched successfully",
      data: trackData,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const streamTrack = async (req, res) => {
  try {
    const { trackId } = req.params;

    const track = await TrackModel.findById(trackId).select("audioFileId audioUrl isPublished");

    if (!track) {
      return res.status(404).json({ message: "Track not found" });
    }

    // If we have an S3 key, generate a short-lived presigned S3 GET URL
    if (track.audioFileId) {
      const streamUrl = await getPresignedGetUrl(track.audioFileId, 3600); // 1 hour
      return res.status(200).json({ streamUrl });
    }

    // Fallback: return the stored URL as-is (legacy tracks)
    return res.status(200).json({ streamUrl: track.audioUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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
    const {
      title,
      audioKey,        // S3 key returned from /upload/presigned-url
      coverImageKey,   // S3 key for cover image (optional)
      artists,
      album,
      genres,
      lang,
      isExplicit,
      copyrightOwner,
      isrc,
      availableCountries,
      duration,
    } = req.body;

    const primaryArtist = req.user.id;

    if (!audioKey) {
      return res.status(400).json({
        message: "audioKey is required (upload the file first via /upload/presigned-url)",
      });
    }

    if (!title) {
      return res.status(400).json({
        message: "title is required",
      });
    }

    // Store CloudFront URL as the playback URL
    const audioUrl = getCloudFrontUrl(audioKey);
    const coverImage = coverImageKey ? getCloudFrontUrl(coverImageKey) : null;

    const track = await TrackModel.create({
      title,
      audioUrl,
      audioFileId: audioKey, // S3 key — used for deletion and re-signing

      duration: duration || 0,

      primaryArtist,
      artists: artists?.length ? artists : [primaryArtist],

      album: album || null,
      genres: genres || [],
      lang: lang || null,

      isExplicit: Boolean(isExplicit),

      copyrightOwner: copyrightOwner || null,
      isrc: isrc || generateISRC(),

      availableCountries: availableCountries || [],

      coverImage,
      coverImageKey: coverImageKey || null,
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

    if (req.body.title) updateData.title = req.body.title;
    if (req.body.artists) updateData.artists = req.body.artists;
    if (req.body.genres) updateData.genres = req.body.genres;
    if (req.body.lang) updateData.lang = req.body.lang;
    if (req.body.coverImageKey) {
      updateData.coverImage = getCloudFrontUrl(req.body.coverImageKey);
      updateData.coverImageKey = req.body.coverImageKey;
    }

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
        await deleteS3Object(track.audioFileId);
      } catch (err) {
        console.log("S3 audio delete failed:", err.message);
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

export const getMyTracks = async (req, res) => {
  try {
    const artistId = req.user.id;

    const tracks = await TrackModel.find({ primaryArtist: artistId })
      .sort({ createdAt: -1 })
      .select("title artists album genres lang isExplicit copyrightOwner isrc availableCountries duration coverImage coverImageKey createdAt updatedAt")
      .lean();

    const data = await Promise.all(
      tracks.map(async (track) => {
        let coverImage = track.coverImage || "";
        const imageKey = track.coverImageKey || getS3KeyFromUrl(track.coverImage);
        if (imageKey) {
          try {
            coverImage = await getPresignedGetUrl(imageKey, 86400);
          } catch {
            // Keep legacy URL if signing fails
          }
        }

        return {
          id: String(track._id),
          title: track.title,
          artists: track.artists || [],
          album: track.album || null,
          genres: track.genres || [],
          lang: track.lang || null,
          isExplicit: Boolean(track.isExplicit),
          copyrightOwner: track.copyrightOwner || null,
          isrc: track.isrc || null,
          availableCountries: track.availableCountries || [],
          durationSeconds: Number(track.duration) || 0,
          coverImage,
          createdAt: track.createdAt,
          updatedAt: track.updatedAt,
        };
      })
    );

    res.status(200).json({
      message: "Tracks fetched successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
