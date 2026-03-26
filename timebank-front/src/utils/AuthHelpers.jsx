const decodeBase64Url = (base64Url) => {
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  return atob(padded);
};

const getTokenPayload = () => {
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

const isAuthenticated = () => {
  const payload = getTokenPayload();
  if (!payload?.exp) return false;
  return payload.exp * 1000 > Date.now();
};

const getUserRole = () => {
  const payload = getTokenPayload();
  if (!payload?.role) return null;
  return String(payload.role).toLowerCase();
};

const isAdmin = () => getUserRole() === 'admin';

export { getTokenPayload, getUserRole, isAdmin, isAuthenticated };