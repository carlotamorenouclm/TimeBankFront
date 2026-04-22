// Normalization and validation helpers used when editing users from admin.
export const normalizeRole = (roleValue) => String(roleValue || '').trim().toUpperCase();

export const normalizeText = (value) => String(value || '').trim();

export const validateEditUserInput = ({ firstName, lastName }) => {
	if (!normalizeText(firstName) || !normalizeText(lastName)) {
		return 'First name and last name are required.';
	}

	return '';
};
