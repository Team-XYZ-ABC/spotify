// hooks/useProfile.js

import { useCallback } from "react";
import { useDispatch } from "react-redux";

import {
  setLoading,
  setProfile,
  setOtherUser,
  updateProfileSuccess,
  setError,
} from "@/features/profile/slice/profile.slice";

import {
  getProfileService,
  otherUserProfileService,
  updateProfileService,
  getAvatarUploadUrlService,
  uploadAvatarToS3,
} from "@/features/profile/services/profile.service";

/**
 * Profile Hook
 * Handles all profile-related business logic
 */
export const useProfile = () => {
  const dispatch = useDispatch();

  /**
   * Fetch logged-in user profile
   */
  const getProfile = useCallback(async () => {
    try {
      dispatch(setLoading(true));

      const res = await getProfileService();

      dispatch(setProfile(res.data || res));
    } catch (err) {
      dispatch(
        setError(
          err?.message || "Failed to fetch profile"
        )
      );
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  /**
   * Update user profile.
   * @param {{ displayName?: string, bio?: string, avatarFile?: File }} data
   */
  const updateProfile = useCallback(
    async (data) => {
      try {
        dispatch(setLoading(true));

        const payload = {};
        if (data.displayName) payload.displayName = data.displayName;
        if (data.bio) payload.bio = data.bio;

        // If a new avatar file is provided, upload to S3 first
        if (data.avatarFile) {
          const { uploadUrl, key } = await getAvatarUploadUrlService(
            data.avatarFile.name,
            data.avatarFile.type
          );
          await uploadAvatarToS3(uploadUrl, data.avatarFile);
          payload.avatarKey = key;
        }

        const res = await updateProfileService(payload);

        const updatedUser =
          res?.user || res?.data?.user || res?.data;

        dispatch(updateProfileSuccess(updatedUser));

        return {
          success: true,
          data: res,
        };
      } catch (err) {
        const message =
          err?.message || "Failed to update profile";

        dispatch(setError(message));

        return {
          success: false,
          error: message,
        };
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  /**
   * Fetch other user's profile
   */
  const getOtherUser = useCallback(
    async (id) => {
      try {
        dispatch(setLoading(true));

        const res = await otherUserProfileService(id);

        dispatch(setOtherUser(res?.data || res));
      } catch (err) {
        dispatch(
          setError(
            err?.message ||
            "Failed to fetch user profile"
          )
        );
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  return {
    getProfile,
    updateProfile,
    getOtherUser,
  };
};