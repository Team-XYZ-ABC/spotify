import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import {
    setUser,
    setLoading,
    setInitializing,
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
    const navigate = useNavigate();

    const { user, error, loading, isInitializing } = useSelector((state) => state.user);

    const handleAsync = useCallback(async (fn) => {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            return await fn();
        } catch (err) {
            dispatch(setError(err.message || "Something went wrong"));
            throw err;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleEmailVerify = useCallback((email) =>
        handleAsync(async () => {
            if (!email) throw new Error("Email is required");
            if (!email.includes("@")) throw new Error("Invalid email");

            const res = await checkEmailExistService(email);
            if (res.exists) throw new Error("Email already registered");

            navigate(`/register/step-1?email=${email}`);
        }),
    [handleAsync, navigate]);

    const registerUser = useCallback((form) =>
        handleAsync(async () => {
            const { email, displayName, username, password } = form;

            if (!email || !displayName || !username || !password) {
                throw new Error("All fields are required");
            }

            if (password.length < 6) {
                throw new Error("Password must be at least 6 characters");
            }

            const res = await registerService(form);
            dispatch(setUser(res.user));
            navigate("/");
        }),
    [handleAsync, dispatch, navigate]);

    const loginUser = useCallback((data) =>
        handleAsync(async () => {
            const res = await loginService(data);
            dispatch(setUser(res.user));
            navigate("/");
            return res;
        }),
    [handleAsync, dispatch, navigate]);

    const logoutUser = useCallback(() =>
        handleAsync(async () => {
            await logoutService();
            dispatch(logoutAction());
            navigate("/login");
        }),
    [handleAsync, dispatch, navigate]);

    const getMe = useCallback(async () => {
        try {
            dispatch(setInitializing(true));
            const res = await getMeService();

            if (!res?.user) {
                dispatch(logoutAction());
                return;
            }

            dispatch(setUser(res.user));
        } catch (error) {
            dispatch(logoutAction());
        }
    }, [dispatch]);

    const clearError = useCallback(() => {
        dispatch(setError(null));
    }, [dispatch]);

    return {
        user, error, loading, isInitializing,
        handleEmailVerify, registerUser, loginUser, logoutUser, getMe, clearError
    };
};

export default useAuth;