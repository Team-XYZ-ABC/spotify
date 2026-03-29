import { Suspense } from "react";
import Loader from "../components/ui/Loader";
import AuthLayout from "../layouts/AuthLayout";

import {
    Login,
    Register,
    RegisterStep1,
    PhoneNumber,
    VerifyOtp
} from "./lazyImports";

export const authRoutes = [
    {
        element: (
            <Suspense fallback={<Loader />}>
                <AuthLayout />
            </Suspense>
        ),
        children: [
            { path: "/login", element: <Login /> },
            { path: "/register", element: <Register /> },
            { path: "/register/step-1", element: <RegisterStep1 /> },
            { path: "/register/phoneRegister", element: <PhoneNumber /> },
            { path: "/register/verify-otp", element: <VerifyOtp /> },
        ],
    },
];