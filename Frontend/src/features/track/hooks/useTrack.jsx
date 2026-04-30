import { useState } from "react";

import {
  getUploadUrlService,
  uploadToS3Service,
  uploadTrackService,
  getTrackService,
  getMyTracksService,
  updateTrackService,
  deleteTrackService,
  getStreamUrlService,
} from "@/features/track/services/track.service";

/** Extract duration (seconds) from an audio File via HTMLAudioElement */
const getAudioDuration = (file) =>
  new Promise((resolve) => {
    const audio = document.createElement("audio");
    const url = URL.createObjectURL(file);
    audio.addEventListener("loadedmetadata", () => {
      URL.revokeObjectURL(url);
      resolve(Math.round(audio.duration) || 0);
    });
    audio.addEventListener("error", () => {
      URL.revokeObjectURL(url);
      resolve(0);
    });
    audio.src = url;
  });

export const useTrack = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Uploads a file to S3 via presigned URL and returns the S3 object key
  const uploadFileToS3 = async (file, folder) => {
    const { uploadUrl, key } = await getUploadUrlService({
      fileName: file.name,
      contentType: file.type,
      folder,
    });

    await uploadToS3Service(uploadUrl, file);

    return key; // S3 object key — send this to backend
  };

  const uploadTrack = async (formDataState) => {
    try {
      setLoading(true);
      setError(null);

      const audioKey = await uploadFileToS3(
        formDataState.file,
        "audio"
      );

      // Extract duration from file before upload response
      const duration = await getAudioDuration(formDataState.file);

      let coverImageKey = null;

      if (formDataState.coverImage) {
        coverImageKey = await uploadFileToS3(
          formDataState.coverImage,
          "covers"
        );
      }

      const payload = {
        title: formDataState.title,
        artists: formDataState.artists
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean),
        album: formDataState.album,
        genres: [formDataState.genre],
        lang: formDataState.language,
        isExplicit: formDataState.isExplicit,
        copyrightOwner: formDataState.copyrightOwner,
        isrc: formDataState.isrc,
        availableCountries: formDataState.countries,
        duration,
        audioKey,
        coverImageKey,
      };

      const res = await uploadTrackService(payload);
      return res;

    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getTrack = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const res = await getTrackService(id);
      return res;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getMyTracks = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getMyTracksService();
      return res;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTrack = async (id, formDataState) => {
    try {
      setLoading(true);
      setError(null);

      const payload = {};

      if (formDataState.title) {
        payload.title = formDataState.title;
      }

      if (formDataState.artists) {
        payload.artists = formDataState.artists
          .split(",")
          .map((a) => a.trim());
      }

      if (formDataState.genre) {
        payload.genres = [formDataState.genre];
      }

      if (formDataState.language) {
        payload.lang = formDataState.language;
      }

      if (formDataState.coverImage) {
        payload.coverImageKey = await uploadFileToS3(
          formDataState.coverImage,
          "covers"
        );
      }

      const res = await updateTrackService(id, payload);
      return res;

    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTrack = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const res = await deleteTrackService(id);
      return res;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch a short-lived presigned stream URL for a track.
   * Call this immediately before setting audio.src — URL expires in 1 hour.
   */
  const getStreamUrl = async (trackId) => {
    try {
      const res = await getStreamUrlService(trackId);
      return res; // { streamUrl }
    } catch (err) {
      setError(err?.message || "Failed to get stream URL");
      throw err;
    }
  };

  return {
    uploadTrack,
    getTrack,
    getMyTracks,
    updateTrack,
    deleteTrack,
    getStreamUrl,
    loading,
    error
  };
};