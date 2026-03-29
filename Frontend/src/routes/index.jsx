import { createBrowserRouter } from "react-router";
import App from "../App";
import MainLayout from "../layouts/MainLayout";
import { publicRoutes } from "./public.routes";
import { authRoutes } from "./auth.routes";
import { privateRoutes } from "./private.routes";
import { NotFound } from "./lazyImports";

import { Suspense } from "react";
import Loader from "../components/ui/Loader";

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
                    ...publicRoutes,
                    ...privateRoutes,
                ],
            },

            ...authRoutes,

            {
                path: "*",
                element: <NotFound />,
            },
        ],
    },
]);