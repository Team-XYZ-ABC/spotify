import { useCallback } from "react";
import { useDispatch } from "react-redux";

import {
  setLoading,
  setProfile,
  setOtherUser,
  updateProfileSuccess,
  setError,
} from "../redux/slices/profile.slice";

import {
  getProfileService,
  otherUserPofileService,
  updateProfileService,
} from "../services/profile.service";

export const useProfile = () => {
  const dispatch = useDispatch();

  const getProfile = useCallback(async () => {
    try {
      dispatch(setLoading(true));

      const res = await getProfileService();

      dispatch(setProfile(res.data || res));
    } catch (err) {
      dispatch(
        setError(
          err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch profile"
        )
      );
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const updateProfile = useCallback(
    async (data) => {
      try {
        dispatch(setLoading(true));

        const res = await updateProfileService(data);
        // Services return the response body directly, so normalize the updated user here.
        const updatedUser = res?.user || res?.data?.user || res?.data;

        dispatch(updateProfileSuccess(updatedUser));

        return {
          success: true,
          data: res,
        };
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to update profile";

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

  const getOtherUser = useCallback(
    async (id) => {
      try {
        dispatch(setLoading(true));

        const res =
          await otherUserPofileService(id);

        dispatch(
          setOtherUser(res?.data || res)
        );
      } catch (err) {
        dispatch(
          setError(
            err?.response?.data?.message ||
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