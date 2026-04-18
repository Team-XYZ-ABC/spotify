import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";
import App from "../App";

// --- Layouts & Guards ---
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import AuthRoute from "../guards/AuthRoute";
import Loader from "../components/ui/Loader";
import Analytics from "../pages/user/Artist/Analytics";
import DashboardLayout from "../layouts/DashboardLayout";
import Playlists from "../pages/user/Artist/Playlists";
import Albums from "../pages/user/Artist/Albums";
import Trending from "../pages/user/Artist/Trending";
import AdsLibrary from "../pages/user/Artist/AdsLibrary";
import UploadTrack from "../pages/user/Artist/UploadTrack";
import Playlist from "../pages/Playlist/Playlist";
import PlaylistList from "../pages/Playlist/PlaylistList";

// --- Lazy Loads ---
const Home = lazy(() => import("../pages/home/Home"));
const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));
const PhoneNumber = lazy(() => import("../pages/auth/PhoneNumber"));
const VerifyOtp = lazy(() => import("../pages/auth/VerifyOtp"));
const RegisterStep1 = lazy(() => import("../pages/auth/RegisterStep1"));
const UserProfile = lazy(() => import("../pages/user/profile/UserProfile"));
const NotFound = lazy(() => import("../components/common/NotFound"));

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                element: (
                    <Suspense fallback={<Loader />}>
                        <MainLayout />
                    </Suspense>
                ),
                children: [
                    // Just drop public paths here in the future
                    // { path: "/about", element: <About /> },
                ],
            },

            {
                element: (
                    <AuthRoute isPrivate={true}>
                        <Suspense fallback={<Loader />}>
                            <MainLayout />
                        </Suspense>
                    </AuthRoute>
                ),
                children: [
                    { path: "/", element: <Home /> },
                    { path: "/playlists", element: <PlaylistList /> },
                    { path: "/playlist", element: <PlaylistList /> },
                    { path: "/playlist/:playlistId", element: <Playlist /> },
                    { path: "/profile", element: <UserProfile /> },
                ],
            },

            {
                element: (
                    <AuthRoute isPrivate={false}>
                        <Suspense fallback={<Loader />}>
                            <AuthLayout />
                        </Suspense>
                    </AuthRoute>
                ),
                children: [
                    { path: "/login", element: <Login /> },
                    { path: "/register", element: <Register /> },
                    { path: "/register/step-1", element: <RegisterStep1 /> },
                    {
                        path: "/register/phoneRegister",
                        element: <PhoneNumber />,
                    },
                    { path: "/register/verify-otp", element: <VerifyOtp /> },
                ],
            },

            {
                path: "*",
                element: (
                    <Suspense fallback={<Loader />}>
                        <NotFound />
                    </Suspense>
                ),
            },
            {
                element: (
                    <AuthRoute isPrivate={true}>
                        <Suspense fallback={<Loader />}>
                            <DashboardLayout />
                        </Suspense>
                    </AuthRoute>
                ),
                children: [
                    { path: "/analytics", element: <Analytics /> },
                    { path: "/playlists", element: <Playlists /> },
                    { path: "/albums", element: <Albums /> },
                    { path: "/trending", element: <Trending /> },
                    { path: "/ads-library", element: <AdsLibrary /> },
                    { path: "/uploadtrack", element: <UploadTrack /> },
                ],
            },
        ],
    },
]);
