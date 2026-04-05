import { useDispatch } from "react-redux";
import {
  setLoading,
  setProfile,
  setOtherUser,
  updateProfileSuccess,
  setError
} from "../redux/slices/profile.slice";
import { getProfileService, otherUserPofileService, updateProfileService } from "../services/profile.service";



export const useProfile = () => {
  const dispatch = useDispatch();

  const getProfile = async () => {
    try {
      dispatch(setLoading(true));

      const res = await getProfileService();

      dispatch(setProfile(res.data));
    } catch (err) {
      dispatch(setError(err.message));
    }
  };

  const updateProfile = async (data) => {
    try {
      dispatch(setLoading(true));

      const res = await updateProfileService(data);

      dispatch(updateProfileSuccess(res.data.user));
    } catch (err) {
      dispatch(setError(err.message));
    }
  };

  const getOtherUser = async (id) => {
    try {
      dispatch(setLoading(true));

      const res = await otherUserPofileService(id);

      dispatch(setOtherUser(res.data));
    } catch (err) {
      dispatch(setError(err.message));
    }
  };

  return {
    getProfile,
    updateProfile,
    getOtherUser
  };
};