import { useState } from "react";
import {
  uploadTrackService,
  getTrackService,
  updateTrackService,
  deleteTrackService
} from "../services/track.service";

export const useTrack = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const uploadTrack = async (formDataState) => {
    try {
      setLoading(true);
      setError(null);

      const data = new FormData();

      data.append("file", formDataState.file);

      if (formDataState.coverImage) {
        data.append("coverImage", formDataState.coverImage);
      }

      data.append("title", formDataState.title);

      data.append(
        "artists",
        JSON.stringify(
          formDataState.artists.split(",").map((a) => a.trim())
        )
      );

      data.append("album", formDataState.album);

      data.append(
        "genres",
        JSON.stringify([formDataState.genre])
      );

      data.append("lang", formDataState.language);

      data.append(
        "isExplicit",
        String(formDataState.isExplicit)
      );

      data.append("copyrightOwner", formDataState.copyrightOwner);
      data.append("isrc", formDataState.isrc);

      data.append(
        "availableCountries",
        JSON.stringify(formDataState.countries)
      );

      const res = await uploadTrackService(data);
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

  const updateTrack = async (id, formDataState) => {
    try {
      setLoading(true);
      setError(null);

      const data = new FormData();

      if (formDataState.title) {
        data.append("title", formDataState.title);
      }

      if (formDataState.artists) {
        data.append(
          "artists",
          JSON.stringify(
            formDataState.artists.split(",").map((a) => a.trim())
          )
        );
      }

      if (formDataState.genre) {
        data.append(
          "genres",
          JSON.stringify([formDataState.genre])
        );
      }

      if (formDataState.language) {
        data.append("lang", formDataState.language);
      }

      if (formDataState.coverImage) {
        data.append("coverImage", formDataState.coverImage);
      }

      const res = await updateTrackService(id, data);
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

  return {
    uploadTrack,
    getTrack,
    updateTrack,
    deleteTrack,
    loading,
    error
  };
};