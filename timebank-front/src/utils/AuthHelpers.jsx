/*
 * Funciones auxiliares compartidas por varias pantallas del frontend.
 *
 * Comentarios generados para documentar la intencion de cada bloque principal.
 */
// Utilidades de autenticacion para validar el JWT guardado en localStorage.
const decodeBase64Url = (base64Url) => {
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  return atob(padded);
};

// Aplica la utilidad de clear auth session de forma reutilizable.
const clearAuthSession = () => {
  localStorage.removeItem('access_token');
};

// Aplica la utilidad de redirect to login de forma reutilizable.
const redirectToLogin = () => {
  if (window.location.pathname !== '/login') {
    window.location.assign('/login');
  }
};

// Aplica la utilidad de is authenticated de forma reutilizable.
const isAuthenticated = () => {
  const token = localStorage.getItem('access_token');
  if (!token) return false;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;

    const payload = JSON.parse(decodeBase64Url(parts[1]));

    if (!payload.exp) return false;
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

// Aplica la utilidad de get auth payload de forma reutilizable.
const getAuthPayload = () => {
  const token = localStorage.getItem('access_token');
  if (!token) return null;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    return JSON.parse(decodeBase64Url(parts[1]));
  } catch {
    return null;
  }
};

// Aplica la utilidad de get authenticated user id de forma reutilizable.
const getAuthenticatedUserId = () => {
  const payload = getAuthPayload();
  if (!payload) return null;

  return payload.id || payload.user_id || payload.sub || payload.uid || null;
};

export { clearAuthSession, getAuthPayload, getAuthenticatedUserId, isAuthenticated, redirectToLogin };
