import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import {
    setUser,
    setLoading,
    setError,
    logout as logoutAction
} from "../redux/slices/auth.slice";

import {
    checkEmailExistService,
    registerService,
    loginService,
    logoutService,
    getMeService
} from "../services/auth.service";

const useAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { user, loading, error } = useSelector((state) => state.user);

    const handleEmailVerify = async (email) => {
        try {
            if (!email) {
                dispatch(setError("Email is required"));
                return;
            }

            if (!email.includes("@")) {
                dispatch(setError("Invalid email"));
                return;
            }

            dispatch(setLoading(true));
            dispatch(setError(null));

            const res = await checkEmailExistService(email);

            if (res.exists) {
                dispatch(setError("Email already registered"));
                return;
            }

            navigate(`/register/step-1?email=${email}`);

        } catch (err) {
            dispatch(setError(err.message || "Something went wrong"));
        } finally {
            dispatch(setLoading(false));
        }
    };

    const registerUser = async (form) => {
        try {
            dispatch(setError(null));

            const { email, displayName, username, password } = form;

            if (!email) {
                dispatch(setError("Email missing"));
                return;
            }

            if (!displayName || !username || !password || !email) {
                dispatch(setError("All fields are required"));
                return;
            }

            if (password.length < 6) {
                dispatch(setError("Password must be at least 6 characters"));
                return;
            }

            dispatch(setLoading(true));

            const res = await registerService(form);

            dispatch(setUser(res.user));

            navigate("/");

        } catch (err) {
            dispatch(setError(err.message || "Registration failed"));
        } finally {
            dispatch(setLoading(false));
        }
    };

    const loginUser = async (data) => {
        try {
            dispatch(setLoading(true));

            const res = await loginService(data);

            dispatch(setUser(res.user));

            return res;

        } catch (err) {
            dispatch(setError(err.message));
            throw err;
        }
    };

    const logoutUser = async () => {
        try {
            dispatch(setLoading(true));

            await logoutService();

            dispatch(logoutAction());

        } catch (err) {
            dispatch(setError(err.message));
        }
    };

    const getMe = async () => {
        try {
            dispatch(setLoading(true));

            const res = await getMeService();

            dispatch(setUser(res.user));

        } catch (err) {
            dispatch(logoutAction());
        }
    };

    return {
        user,
        loading,
        error,
        handleEmailVerify,
        registerUser,
        loginUser,
        logoutUser,
        getMe
    };
};

export default useAuth;