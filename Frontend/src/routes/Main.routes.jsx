import { createBrowserRouter } from "react-router";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import Home from "../pages/home/Home";
import Feed from "../components/common/Feed";
import App from "../App";
import PhoneNumber from "../pages/auth/PhoneNumber";
import VerifyOtp from "../pages/auth/VerifyOtp";

export const Router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '/register',
                element: <Register />
            },
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/phoneRegister',
                element: <PhoneNumber />
            },
            {
                path: '/verifyOtp',
                element: <VerifyOtp />
            },
            {
                path: '/Home',
                element: <Home />
            },
        ]
    }
])