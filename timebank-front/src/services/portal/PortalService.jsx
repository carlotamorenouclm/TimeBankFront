/*
 * Contiene logica de negocio reutilizable entre rutas y consultas.
 *
 * Comentarios generados para documentar la intencion de cada bloque principal.
 */
// Private user-area services: dashboard, inbox, wallet, and history.
import { apiRequest } from '../api/ApiClient';

// Ejecuta la operacion de get portal summary contra la API.
export const getPortalSummary = () => apiRequest('/portal/summary');

// Ejecuta la operacion de get my profile contra la API.
export const getMyProfile = () => apiRequest('/me');

// Ejecuta la operacion de update my profile contra la API.
export const updateMyProfile = (payload) =>
  apiRequest('/me/update', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

// Ejecuta la operacion de change my password contra la API.
export const changeMyPassword = (payload) =>
  apiRequest('/me/password', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

// Ejecuta la operacion de delete my account contra la API.
export const deleteMyAccount = () =>
  apiRequest('/me/delete', {
    method: 'DELETE',
  });

// Ejecuta la operacion de get dashboard services contra la API.
export const getDashboardServices = () => apiRequest('/portal/dashboard');

// Ejecuta la operacion de get history contra la API.
export const getHistory = () => apiRequest('/portal/history');

// Ejecuta la operacion de mark history notifications read contra la API.
export const markHistoryNotificationsRead = (transactionType) =>
  apiRequest('/portal/history/notifications/read', {
    method: 'POST',
    body: JSON.stringify({ transaction_type: transactionType }),
  });

// Ejecuta la operacion de create service request contra la API.
export const createServiceRequest = (serviceOfferId, payload) =>
  apiRequest(`/portal/services/${serviceOfferId}/request`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

// Ejecuta la operacion de create service offer contra la API.
export const createServiceOffer = (payload) =>
  apiRequest('/portal/services', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

// Ejecuta la operacion de delete service offer contra la API.
export const deleteServiceOffer = (serviceOfferId) =>
  apiRequest(`/portal/services/${serviceOfferId}`, {
    method: 'DELETE',
  });

// Ejecuta la operacion de get inbox contra la API.
export const getInbox = () => apiRequest('/portal/inbox');

// Ejecuta la operacion de accept inbox request contra la API.
export const acceptInboxRequest = (requestId, clarification) =>
  apiRequest(`/portal/inbox/${requestId}/accept`, {
    method: 'POST',
    body: JSON.stringify({ clarification }),
  });

// Ejecuta la operacion de reject inbox request contra la API.
export const rejectInboxRequest = (requestId, reason) =>
  apiRequest(`/portal/inbox/${requestId}/reject`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });

// Ejecuta la operacion de complete request contra la API.
export const completeRequest = (requestId) =>
  apiRequest(`/portal/requests/${requestId}/complete`, {
    method: 'POST',
  });

// Ejecuta la operacion de submit review contra la API.
export const submitReview = (payload) =>
  apiRequest('/reviews', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

// Ejecuta la operacion de get transaction reviews contra la API.
export const getTransactionReviews = (transactionId) =>
  apiRequest(`/reviews/${transactionId}`);

// Ejecuta la operacion de get service reviews contra la API.
export const getServiceReviews = (serviceOfferId) =>
  apiRequest(`/reviews/services/${serviceOfferId}`);

// Ejecuta la operacion de get wallet contra la API.
export const getWallet = () => apiRequest('/portal/wallet');

// Ejecuta la operacion de create wallet checkout session contra la API.
export const createWalletCheckoutSession = (amount) =>
  apiRequest('/portal/wallet/checkout-session', {
    method: 'POST',
    body: JSON.stringify({ amount }),
  });
