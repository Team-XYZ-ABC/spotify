import { Navigate } from "react-router";
import { useSelector } from "react-redux";

const AuthRoute = ({ children, isPrivate, roles }) => {
    const { user, isInitializing } = useSelector((state) => state.user);

    if (isInitializing) {
        return (
            <div className="h-screen w-full flex items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    if (isPrivate && !user) return <Navigate to="/login" replace />;
    if (!isPrivate && user) return <Navigate to="/" replace />;
    if (roles && !roles.includes(user?.role)) return <Navigate to="/unauthorized" replace />;

    return children;
};

export default AuthRoute;