import { UserProfile } from "./LazyImports";
import ProtectedRoute from "../guards/ProtectedRoute";

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