import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ canAccess, redirectPath="/" }) => {
    if (!canAccess) {
        return <Navigate to={redirectPath} replace />;
    }
    return <Outlet />;
}

export default ProtectedRoute;