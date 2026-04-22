// Utilidades de autenticacion para validar el JWT guardado en localStorage.
const decodeBase64Url = (base64Url) => {
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  return atob(padded);
};

const clearAuthSession = () => {
  localStorage.removeItem('access_token');
};

const redirectToLogin = () => {
  if (window.location.pathname !== '/login') {
    window.location.assign('/login');
  }
};

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

export { clearAuthSession, isAuthenticated, redirectToLogin };
