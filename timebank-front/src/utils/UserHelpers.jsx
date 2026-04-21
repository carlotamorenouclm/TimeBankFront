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
  const parsedTimeTokens = Number(
    user.timeTokens ?? user.time_tokens ?? user.tokens ?? user.balance ?? user.hours ?? 0
  );

  return {
    id: user.id || user._id || `${firstName}-${lastName}-${idx}`,
    firstName,
    lastName,
    email: user.email || user.mail || '',
    timeTokens: Number.isFinite(parsedTimeTokens) ? parsedTimeTokens : 0
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