const API_URL = import.meta.env.VITE_API_URL;

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

export const checkIfAdmin = async (accessToken) => {
	try {
		if (!API_URL) {
			throw new Error('VITE_API_URL is not configured');
		}

		if (!accessToken) {
			throw new Error('Missing access token');
		}

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
