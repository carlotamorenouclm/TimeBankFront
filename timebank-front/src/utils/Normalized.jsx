/*
 * Funciones auxiliares compartidas por varias pantallas del frontend.
 *
 * Comentarios generados para documentar la intencion de cada bloque principal.
 */
// Normalization and validation helpers used when editing users from admin.
export const normalizeRole = (roleValue) => String(roleValue || '').trim().toUpperCase();

// Aplica la utilidad de normalize text de forma reutilizable.
export const normalizeText = (value) => String(value || '').trim();

// Aplica la utilidad de validate edit user input de forma reutilizable.
export const validateEditUserInput = ({ firstName, lastName }) => {
	if (!normalizeText(firstName) || !normalizeText(lastName)) {
		return 'First name and last name are required.';
	}

	return '';
};
