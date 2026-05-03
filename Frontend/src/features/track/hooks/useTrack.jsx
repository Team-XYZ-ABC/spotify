import { useState } from "react";
import api from "@/shared/config/axios.config";

import {
  getUploadUrlService,
  uploadToS3Service,
  uploadTrackService,
  getTrackService,
  getMyTracksService,
  updateTrackService,
  deleteTrackService,
  getStreamUrlService,
  getSongUploadUrlService,
  confirmSongUploadService,
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
  const [uploadProgress, setUploadProgress] = useState(0); // raw S3 PUT progress
  const [processingProgress, setProcessingProgress] = useState(null); // { progress, status, statusMessage }

  // Upload generic asset (cover image, etc.) via the legacy /upload/presigned-url
  const uploadFileToS3 = async (file, folder) => {
    const { uploadUrl, key } = await getUploadUrlService({
      fileName: file.name,
      contentType: file.type,
      folder,
    });
    await uploadToS3Service(uploadUrl, file);
    return key;
  };

  /**
   * HLS upload pipeline:
   *   1. Request presigned PUT URL via /songs/upload-url
   *   2. PUT raw audio directly to S3 (with progress)
   *   3. Confirm via /songs/confirm-upload (creates Track in "processing")
   *   4. Resolve immediately so the form can close. A background SSE
   *      listener keeps `processingProgress` updated for any UI that
   *      cares; the Songs page also subscribes per-row independently.
   */
  const uploadTrack = async (formDataState, { onProgress } = {}) => {
    try {
      setLoading(true);
      setError(null);
      setUploadProgress(0);
      setProcessingProgress({ stage: "uploading", progress: 0, status: "uploading" });

      // 1. Audio presigned URL
      const audio = formDataState.file;
      const { uploadUrl, key: audioKey } = await getSongUploadUrlService({
        fileName: audio.name,
        contentType: audio.type,
      });

      // 2. Direct upload to S3 with progress
      await uploadToS3Service(uploadUrl, audio, (pct) => {
        setUploadProgress(pct);
        setProcessingProgress({ stage: "uploading", progress: pct, status: "uploading" });
        onProgress?.({ stage: "uploading", progress: pct });
      });

      const duration = await getAudioDuration(audio);

      let coverImageKey = null;
      if (formDataState.coverImage) {
        coverImageKey = await uploadFileToS3(formDataState.coverImage, "covers");
      }

      // 3. Confirm — creates DB entry & kicks off FFmpeg pipeline (server-side, async)
      const payload = {
        title: formDataState.title,
        artists: formDataState.artists.split(",").map((a) => a.trim()).filter(Boolean),
        album: formDataState.album || undefined,
        genres: formDataState.genre ? [formDataState.genre] : [],
        lang: formDataState.language || undefined,
        isExplicit: !!formDataState.isExplicit,
        copyrightOwner: formDataState.copyrightOwner || undefined,
        isrc: formDataState.isrc || undefined,
        availableCountries: formDataState.countries || [],
        duration,
        audioKey,
        coverImageKey: coverImageKey || undefined,
      };

      const confirmRes = await confirmSongUploadService(payload);
      const songId = confirmRes?.data?.id;

      // 4. Background SSE — never await. Updates state for any subscribed UI.
      if (songId) listenForProgress(songId, onProgress);

      setProcessingProgress({
        stage: "processing",
        progress: confirmRes?.data?.progress ?? 0,
        status: confirmRes?.data?.status || "processing",
      });

      return confirmRes;
    } catch (err) {
      setError(err.message || "Upload failed");
      throw err;
    } finally {
      // Form can close — processing continues server-side.
      setLoading(false);
    }
  };

  /**
   * Subscribe to SSE progress for a song. Falls back to polling every 2s
   * if the EventSource connection breaks (CORS / proxy / etc).
   */
  const listenForProgress = (songId, onProgress) => {
    const base = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";
    let stopped = false;
    let pollTimer = null;

    const apply = (data) => {
      setProcessingProgress({
        stage: data.status,
        progress: data.progress,
        status: data.status,
        statusMessage: data.statusMessage,
      });
      onProgress?.(data);
    };

    const startPolling = () => {
      if (pollTimer) return;
      pollTimer = setInterval(async () => {
        if (stopped) return clearInterval(pollTimer);
        try {
          const res = await api.get(`/songs/status/${songId}`);
          const data = res.data?.data || res.data;
          apply(data);
          if (data.status === "ready" || data.status === "failed") {
            stopped = true;
            clearInterval(pollTimer);
          }
        } catch {
          /* keep trying */
        }
      }, 2000);
    };

    let es;
    try {
      es = new EventSource(`${base}/songs/progress/${songId}`, {
        withCredentials: true,
      });
      es.onmessage = (ev) => {
        try {
          const data = JSON.parse(ev.data);
          apply(data);
          if (data.status === "ready" || data.status === "failed") {
            stopped = true;
            es.close();
          }
        } catch {
          /* ignore */
        }
      };
      es.onerror = () => {
        // EventSource auto-reconnects; if the connection is permanently
        // broken (e.g. browser tab refresh, CORS), fall back to polling.
        if (es.readyState === EventSource.CLOSED) {
          startPolling();
        }
      };
    } catch {
      startPolling();
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
      if (formDataState.title) payload.title = formDataState.title;
      if (formDataState.artists) {
        payload.artists = formDataState.artists.split(",").map((a) => a.trim());
      }
      if (formDataState.genre) payload.genres = [formDataState.genre];
      if (formDataState.language) payload.lang = formDataState.language;
      if (formDataState.coverImage) {
        payload.coverImageKey = await uploadFileToS3(formDataState.coverImage, "covers");
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
   * Fetch a stream URL (HLS master if processed, presigned MP3 otherwise).
   * @returns {{ streamUrl, type: "hls" | "mp3" }}
   */
  const getStreamUrl = async (trackId) => {
    try {
      const res = await getStreamUrlService(trackId);
      return res;
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
    error,
    uploadProgress,
    processingProgress,
  };
};