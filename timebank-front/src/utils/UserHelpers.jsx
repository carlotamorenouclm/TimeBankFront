// Helpers to normalize user responses and backend error payloads.
export const extractArrayPayload = (payload) => {
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

export const normalizeUser = (user, idx) => {
  const firstName = user.firstName || user.name || user.first_name || '';
  const lastName = user.lastName || user.surname || user.last_name || '';

  return {
    id: user.id || user._id || `${firstName}-${lastName}-${idx}`,
    firstName,
    lastName,
    email: user.email || user.mail || ''
  };
};

export const validateApiAndAccessToken = (apiUrl, accessToken) => {
  if (!apiUrl) {
    throw new Error('VITE_API_URL is not configured');
  }

  if (!accessToken) {
    throw new Error('Missing access token');
  }
};

export const parseApiError = (responseData, status) => {
  const detail = responseData?.detail;

  if (Array.isArray(detail)) {
    const formatted = detail
      .map((item) => `${item?.loc?.join('.') || 'field'}: ${item?.msg || 'invalid value'}`)
      .join(' | ');
    return formatted || `Request failed (status ${status})`;
  }

  if (typeof detail === 'string' && detail.trim()) {
    return detail;
  }

  return `Request failed (status ${status})`;
};
