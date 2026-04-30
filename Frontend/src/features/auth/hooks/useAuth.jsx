import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { validateEmail, validateDisplayName, validateUsername, validatePassword } from "@/shared/utils/validator";
import {
    setUser,
    setLoading,
    setInitializing,
    setError,
    logout as logoutAction
} from "@/features/auth/slice/auth.slice";
import {
    checkEmailExistService,
    registerService,
    loginService,
    logoutService,
    getMeService
} from "@/features/auth/services/auth.service";

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
            if (!validateEmail(email)) throw new Error("Invalid email");

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
            if (!validateEmail(email)) {
                throw new Error("Invalid email");
            }
            if (!validateDisplayName(displayName)) {
                throw new Error("Display name must be between 3 and 50 characters");
            }
            if (!validateUsername(username)) {
                throw new Error("Username must be 3-30 characters, no spaces or special characters");
            }
            if (!validatePassword(password)) {
                throw new Error("Password must be at least 6 characters");
            }

            const res = await registerService(form);
            dispatch(setUser(res?.user));
            navigate("/");
        }),
        [handleAsync, dispatch, navigate]);

    const loginUser = useCallback((data) =>
        handleAsync(async () => {
            const res = await loginService(data);
            dispatch(setUser(res?.user));
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
            const user = res?.user;

            if (!user) {
                dispatch(logoutAction());
                return;
            }

            dispatch(setUser(user));
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