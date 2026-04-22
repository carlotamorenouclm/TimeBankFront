// Private user-area services: dashboard, inbox, wallet, and history.
import { apiRequest } from '../api/ApiClient';

export const getPortalSummary = () => apiRequest('/portal/summary');

export const getMyProfile = () => apiRequest('/me');

export const updateMyProfile = (payload) =>
  apiRequest('/me/update', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const deleteMyAccount = () =>
  apiRequest('/me/delete', {
    method: 'DELETE',
  });

export const getDashboardServices = () => apiRequest('/portal/dashboard');

export const getHistory = () => apiRequest('/portal/history');

export const createServiceRequest = (serviceOfferId, payload) =>
  apiRequest(`/portal/services/${serviceOfferId}/request`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const createServiceOffer = (payload) =>
  apiRequest('/portal/services', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const deleteServiceOffer = (serviceOfferId) =>
  apiRequest(`/portal/services/${serviceOfferId}`, {
    method: 'DELETE',
  });

export const getInbox = () => apiRequest('/portal/inbox');

export const acceptInboxRequest = (requestId, clarification) =>
  apiRequest(`/portal/inbox/${requestId}/accept`, {
    method: 'POST',
    body: JSON.stringify({ clarification }),
  });

export const rejectInboxRequest = (requestId, reason) =>
  apiRequest(`/portal/inbox/${requestId}/reject`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });

export const getWallet = () => apiRequest('/portal/wallet');

export const rechargeWallet = (amount) =>
  apiRequest('/portal/wallet/recharge', {
    method: 'POST',
    body: JSON.stringify({ amount }),
  });
