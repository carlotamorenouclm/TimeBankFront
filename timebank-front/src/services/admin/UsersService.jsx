import { API_URL, USERS_PATH, ADMINS_PATH, UPDATE_ROLE_TIME_TOKENS_PATH } from '../../constants/paths';
import {
  extractArrayPayload, normalizeUser, validateApiAndAccessToken} from '../../utils/UserHelpers';

const fetchUsersFromPath = async (path, accessToken) => {
  validateApiAndAccessToken(API_URL, accessToken);

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

export const checkIfAdmin = async (accessToken) => {
	try {
		validateApiAndAccessToken(API_URL, accessToken);

		const response = await fetch(`${API_URL}/me/isAdmin`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		});

		const responseData = await response.json().catch(() => null);

		if (!response.ok) {
			const error = responseData?.detail;
			throw new Error(error || `Admin validation failed (status ${response.status})`);
		}

		return Boolean(responseData);
	} catch (error) {
		console.error('Error validating admin access:', error);
		throw error;
	}
};

export const updateRoleTimeTokens = async ({ userId, newRole, newTimeTokens, accessToken }) => {
  validateApiAndAccessToken(API_URL, accessToken);

  const params = new URLSearchParams({
    new_role: newRole,
    new_time_tokens: String(newTimeTokens)
  });

  const response = await fetch(
    `${API_URL}${ADMINS_PATH}${UPDATE_ROLE_TIME_TOKENS_PATH}/${userId}?${params.toString()}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );

  const responseData = await response.json().catch(() => null);

  if (!response.ok) {
    const error = responseData?.detail;
    throw new Error(error || `Request failed (status ${response.status})`);
  }

  return true;
};