export const normalizeRole = (roleValue) => String(roleValue || '').trim().toUpperCase();

export const normalizeText = (value) => String(value || '').trim();

export const normalizeTimeTokens = (value) => {
	const parsedValue = Number(value);
	return Number.isFinite(parsedValue) ? Math.floor(parsedValue) : 0;
};

export const validateEditUserInput = ({ firstName, lastName, timeTokens }) => {
	if (!normalizeText(firstName) || !normalizeText(lastName)) {
		return 'Nombre y apellido son obligatorios.';
	}

	if (normalizeTimeTokens(timeTokens) < 0) {
		return 'Time tokens no puede ser negativo.';
	}

	return '';
};
