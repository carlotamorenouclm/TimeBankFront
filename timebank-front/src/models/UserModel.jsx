/*
 * Define modelos SQLAlchemy que representan tablas de la base de datos.
 *
 * Comentarios generados para documentar la intencion de cada bloque principal.
 */
// Adapta los datos del formulario de registro al formato esperado por la API.
export const UserData = (firstName, lastName, email, password) => {
  return {
    name: firstName,
    surname: lastName,
    email: email,
    password: password
  };
};
