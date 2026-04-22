// Wrapper de rutas privadas: redirige si el usuario no cumple la condicion de acceso.
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ canAccess, redirectPath="/login" }) => {
    const hasAccess = typeof canAccess === 'function' ? canAccess() : Boolean(canAccess);

    if (!hasAccess) {
        return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;
