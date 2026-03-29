import ProtectedRoute from "../guards/ProtectedRoute";
import { UserProfile } from "./lazyImports";

export const privateRoutes = [
    {
        path: "/profile",
        element: (
            <ProtectedRoute>
                <UserProfile />
            </ProtectedRoute>
        ),
    },
];