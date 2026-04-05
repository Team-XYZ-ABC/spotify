import { createBrowserRouter } from "react-router";
import App from "../App";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import ProtectedRoute from "../guards/ProtectedRoute";
import Home from "../pages/home/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import RegisterStep1 from "../pages/auth/RegisterStep1";
import PhoneNumber from "../pages/auth/PhoneNumber";
import VerifyOtp from "../pages/auth/VerifyOtp";
import UserMenuCard from "../components/ui/UserMenuCard";
import NotFound from "../components/common/NotFound";
import UserProfile from "../pages/user/Profile/UserProfile";
import Account from "../pages/user/Account/Account";
import Analytics from "../pages/user/Artist/Analytics";
import DashboardLayout from "../layouts/DashboardLayout";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                element: <MainLayout />,
                children: [
                    {
                        path: "/",
                        element: <Home />,
                    },
                    {
                        path: "/profile",
                        element: (
                            <ProtectedRoute>
                                <UserProfile />
                            </ProtectedRoute>
                        ),
                    },
                    {
                        path: "/account",
                        element: <Account />,
                    },
                    {
                        path: "/profileCard",
                        element: <UserMenuCard />,
                    },
                ],
            },
            {
                element: <AuthLayout />,
                children: [
                    { path: "/login", element: <Login /> },
                    { path: "/register", element: <Register /> },
                    { path: "/register/step-1", element: <RegisterStep1 /> },
                    {
                        path: "/register/phoneRegister",
                        element: <PhoneNumber />,
                    },
                    { path: "/register/verify-otp", element: <VerifyOtp /> },
                    { path: "/registerstep1", element: <RegisterStep1 /> },
                    { path: "/phoneRegister", element: <PhoneNumber /> },
                    { path: "/verifyOtp", element: <VerifyOtp /> },
                ],
            },
            {
               element: <DashboardLayout />,
               children: [
                {
                    path: '/analytics',
                    element: <Analytics/>
                }
               ] 
            },
            {
                path: "*",
                element: <NotFound />,
            },
        ],
    },
]);
