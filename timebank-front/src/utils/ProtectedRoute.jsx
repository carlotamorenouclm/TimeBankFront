/*
 * Funciones auxiliares compartidas por varias pantallas del frontend.
 *
 * Comentarios generados para documentar la intencion de cada bloque principal.
 */
// Wrapper de rutas privadas: redirige si el usuario no cumple la condicion de acceso.
import { Navigate, Outlet } from 'react-router-dom';

// Aplica la utilidad de protected route de forma reutilizable.
const ProtectedRoute = ({ canAccess, redirectPath="/login" }) => {
    const hasAccess = typeof canAccess === 'function' ? canAccess() : Boolean(canAccess);

    if (!hasAccess) {
        return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;
