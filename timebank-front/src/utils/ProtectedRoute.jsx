import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ canAccess, redirectPath="/" }) => {
    const hasAccess = typeof canAccess === 'function' ? canAccess() : Boolean(canAccess);

    if (!hasAccess) {
        return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;