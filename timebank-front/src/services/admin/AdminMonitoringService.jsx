/*
 * Contiene logica de negocio reutilizable entre rutas y consultas.
 *
 * Comentarios generados para documentar la intencion de cada bloque principal.
 */
// Admin monitoring services for user wallet and transaction history.
import { apiRequest } from '../api/ApiClient';

// Ejecuta la operacion de get admin wallet history contra la API.
export const getAdminWalletHistory = (userId) => {
  if (!userId) {
    throw new Error('Missing user id for wallet history');
  }

  return apiRequest(`/admins/wallet/history?user_id=${encodeURIComponent(userId)}`);
};

// Ejecuta la operacion de get admin transaction history contra la API.
export const getAdminTransactionHistory = (userId) => {
  if (!userId) {
    throw new Error('Missing user id for transaction history');
  }

  return apiRequest(`/admins/transaction/history?user_id=${encodeURIComponent(userId)}`);
};

// Ejecuta la operacion de get admin user reviews contra la API.
export const getAdminUserReviews = (userId) => {
  if (!userId) {
    throw new Error('Missing user id for reviews');
  }

  return apiRequest(`/admins/reviews?user_id=${encodeURIComponent(userId)}`);
};

// Ejecuta la operacion de get admin user services contra la API.
export const getAdminUserServices = (userId) => {
  if (!userId) {
    throw new Error('Missing user id for services');
  }

  return apiRequest(`/admins/services?user_id=${encodeURIComponent(userId)}`);
};

// Ejecuta la operacion de update admin service visibility contra la API.
export const updateAdminServiceVisibility = (serviceId, isVisible) => {
  if (!serviceId) {
    throw new Error('Missing service id');
  }

  return apiRequest(`/admins/services/${serviceId}/visibility`, {
    method: 'PATCH',
    body: JSON.stringify({
      is_visible: isVisible,
    }),
  });
};

// Ejecuta la operacion de delete admin service contra la API.
export const deleteAdminService = (serviceId) => {
  if (!serviceId) {
    throw new Error('Missing service id');
  }

  return apiRequest(`/admins/services/${serviceId}`, {
    method: 'DELETE',
  });
};

// Ejecuta la operacion de delete admin review contra la API.
export const deleteAdminReview = (reviewId) => {
  if (!reviewId) {
    throw new Error('Missing review id');
  }

  return apiRequest(`/admins/reviews/${reviewId}`, {
    method: 'DELETE',
  });
};
