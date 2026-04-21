import { API_URL } from '../../constants/paths';

export const loginUser = async ({ email, password }) => {
	try {
		if (!API_URL) {
			throw new Error('VITE_API_URL is not configured');
		}

		const formData = new URLSearchParams();
		formData.append('username', email);
		formData.append('password', password);

		const response = await fetch(`${API_URL}/auth/token`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: formData.toString()
		});

		const responseData = await response.json().catch(() => ({}));

		if (!response.ok) {
			const error = responseData?.detail;
			throw new Error(error || `Login failed (status ${response.status})`);
		}

		return responseData;
	} catch (error) {
		console.error('Error logging in user:', error);
		throw error;
	}
};
