import { lazy } from "react";

export const Home = lazy(() => import("../pages/home/Home"));
export const Login = lazy(() => import("../pages/auth/Login"));
export const Register = lazy(() => import("../pages/auth/Register"));
export const PhoneNumber = lazy(() => import("../pages/auth/PhoneNumber"));
export const VerifyOtp = lazy(() => import("../pages/auth/VerifyOtp"));
export const RegisterStep1 = lazy(() => import("../pages/auth/RegisterStep1"));
export const UserProfile = lazy(() => import("../pages/home/UserProfile"));
export const NotFound = lazy(() => import("../components/common/NotFound"));