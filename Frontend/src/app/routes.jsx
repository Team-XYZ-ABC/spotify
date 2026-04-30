import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";
import App from "@/App";

// --- Layouts & Guards ---
import MainLayout from "@/shared/layouts/MainLayout";
import AuthLayout from "@/shared/layouts/AuthLayout";
import AuthRoute from "@/features/auth/guards/AuthRoute";
import Loader from "@/shared/components/ui/Loader";
import Analytics from "@/features/artist-dashboard/pages/Analytics";
import DashboardLayout from "@/shared/layouts/DashboardLayout";
import Playlists from "@/features/artist-dashboard/pages/Playlists";
import Albums from "@/features/artist-dashboard/pages/Albums";
import Trending from "@/features/artist-dashboard/pages/Trending";
import AdsLibrary from "@/features/artist-dashboard/pages/AdsLibrary";
import UploadTrack from "@/features/artist-dashboard/pages/UploadTrack";
import Songs from "@/features/artist-dashboard/pages/Songs";
import Playlist from "@/features/playlist/pages/Playlist";
import PlaylistList from "@/features/playlist/pages/PlaylistList";
import AccountPage from "@/features/profile/pages/AccountPage";
import ViewTrack from "@/features/track/pages/ViewTrack";

// --- Lazy Loads ---
const Home = lazy(() => import("@/features/home/pages/Home"));
const Login = lazy(() => import("@/features/auth/pages/Login"));
const Register = lazy(() => import("@/features/auth/pages/Register"));
const PhoneNumber = lazy(() => import("@/features/auth/pages/PhoneNumber"));
const VerifyOtp = lazy(() => import("@/features/auth/pages/VerifyOtp"));
const RegisterStep1 = lazy(() => import("@/features/auth/pages/RegisterStep1"));
const UserProfile = lazy(() => import("@/features/profile/pages/UserProfile"));
const Account = lazy(() => import("@/features/profile/pages/Account"));
const NotFound = lazy(() => import("@/shared/components/common/NotFound"));

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
                    {
                        path: "/track/:trackId",
                        element: <ViewTrack/>
                    }
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
            { path: "/account", element: <AccountPage /> },
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
                    <AuthRoute isPrivate={true} roles={["artist"]}>
                        <Suspense fallback={<Loader />}>
                            <DashboardLayout />
                        </Suspense>
                    </AuthRoute>
                ),
                children: [
                    { path: "/analytics", element: <Analytics /> },
                    { path: "/artist/playlists", element: <Playlists /> },
                    { path: "/albums", element: <Albums /> },
                    { path: "/trending", element: <Trending /> },
                    { path: "/ads-library", element: <AdsLibrary /> },
                    { path: "/uploadtrack", element: <UploadTrack /> },
                    { path: "/songs", element: <Songs /> },
                    {
                        path: "/unauthorized",
                        element: <div>Access Denied 🚫</div>
                    }
                ],
            },
        ],
    },
]);
