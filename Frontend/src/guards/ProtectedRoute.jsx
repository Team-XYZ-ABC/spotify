import { Navigate } from "react-router";
import { useSelector } from "react-redux";
import Loader from "../components/ui/Loader";

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useSelector((state) => state.auth);

    if (loading) {
        return <Loader/>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;