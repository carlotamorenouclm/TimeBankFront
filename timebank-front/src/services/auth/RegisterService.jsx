const API_URL = import.meta.env.VITE_API_URL;
import { UserData } from '../../models/UserModel';

export const registerUser = async ({ firstName, lastName, email, password }) => {
  try {
    if (!API_URL) {
      throw new Error('VITE_API_URL is not configured');
    }

    const userData = UserData(firstName, lastName, email, password);
    const candidatePaths = ['/api/users/signup', '/users/signup', '/api/register', '/register'];
    let lastError = null;

    for (const path of candidatePaths) {
      const response = await fetch(`${API_URL}${path}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json',},
        body: JSON.stringify(userData),
      });

      const rawBody = await response.text();
      let parsedBody = null;

      if (rawBody) {
        try {
          parsedBody = JSON.parse(rawBody);
        } catch {
          // The API may return plain text or an empty body.
        }
      }

      if (response.ok) {
        return parsedBody;
      }

      if (response.status !== 404) {
        const errorMessage =
          parsedBody?.message ||
          rawBody ||
          `Registration failed (status ${response.status})`;
        throw new Error(errorMessage);
      }

      lastError = new Error(`Registration endpoint not found at ${path}`);
    }

    throw lastError || new Error('Registration failed');
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};
