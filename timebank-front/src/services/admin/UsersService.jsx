const API_URL = import.meta.env.VITE_API_URL;
const USERS_PATH = import.meta.env.VITE_USERS_LIST_PATH || '/users';
const ADMINS_PATH = import.meta.env.VITE_ADMINS_LIST_PATH || '/admins';

const extractArrayPayload = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.users)) {
    return payload.users;
  }

  if (Array.isArray(payload?.admins)) {
    return payload.admins;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  return [];
};

const normalizeUser = (user, idx) => {
  const firstName = user.firstName || user.name || user.first_name || '';
  const lastName = user.lastName || user.surname || user.last_name || '';

  return {
    id: user.id || user._id || `${firstName}-${lastName}-${idx}`,
    firstName,
    lastName,
    email: user.email || user.mail || ''
  };
};

const fetchUsersFromPath = async (path, accessToken) => {
  if (!API_URL) {
    throw new Error('VITE_API_URL is not configured');
  }

  if (!accessToken) {
    throw new Error('Missing access token');
  }

  const response = await fetch(`${API_URL}${path}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  const responseData = await response.json().catch(() => null);

  if (!response.ok) {
    const error = responseData?.detail;
    throw new Error(error || `Request failed (status ${response.status})`);
  }

  return extractArrayPayload(responseData).map(normalizeUser);
};

export const getAllUsers = async (accessToken) => {
  try {
    return await fetchUsersFromPath(USERS_PATH, accessToken);
  } catch (error) {
    console.error('Error fetching users list:', error);
    throw error;
  }
};

export const getAllAdmins = async (accessToken) => {
  try {
    return await fetchUsersFromPath(ADMINS_PATH, accessToken);
  } catch (error) {
    console.error('Error fetching admins list:', error);
    throw error;
  }
};