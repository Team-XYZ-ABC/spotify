import { createBrowserRouter } from "react-router";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import Home from "../pages/home/Home";
import Feed from "../components/common/Feed";
import App from "../App";
import PhoneNumber from "../pages/auth/PhoneNumber";
import VerifyOtp from "../pages/auth/VerifyOtp";
import RegisterStep1 from "../pages/auth/RegisterStep1";
import UserProfile from "../pages/home/UserProfile";
import NotFound from "../components/common/NotFound";

export const Router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/register",
                element: <Register />,
            },
            {
                path: "/registerstep1",
                element: <RegisterStep1 />,
            },
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/phoneRegister",
                element: <PhoneNumber />,
            },
            {
                path: "/verifyOtp",
                element: <VerifyOtp />,
            },
            {
                path: "/profileCard",
                element: <UserProfile />,
            },
            {
                path: '*',
                element: <NotFound/>
            }
        ],
    },
]);
