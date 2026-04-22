// Cliente HTTP generico para las rutas del portal que requieren token y JSON.
const API_URL = import.meta.env.VITE_API_URL;
import { clearAuthSession, redirectToLogin } from '../../utils/AuthHelpers';

const getAuthHeaders = (includeJson = true) => {
  const token = localStorage.getItem('access_token');
  const headers = {};

  if (includeJson) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

export const apiRequest = async (path, options = {}) => {
  if (!API_URL) {
    throw new Error('VITE_API_URL is not configured');
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...getAuthHeaders(Boolean(options.body)),
      ...(options.headers || {}),
    },
  });

  const responseData = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401) {
      clearAuthSession();
      redirectToLogin();
    }

    throw new Error(responseData?.detail || `Request failed (status ${response.status})`);
  }

  return responseData;
};
