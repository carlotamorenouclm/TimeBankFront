import { UserData } from '../../models/UserModel';
import { API_URL } from '../../constants/paths';


export const registerUser = async ({ firstName, lastName, email, password }) => {
  try {
    if (!API_URL) {
      throw new Error('VITE_API_URL is not configured');
    }

    const userData = UserData(firstName, lastName, email, password);

    const response = await fetch(`${API_URL}/users/signup`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},body: JSON.stringify(userData)});

    if (!response.ok) {
      throw new Error(`Registration failed (status ${response.status})`);
    }
    return await response.json();

  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};
