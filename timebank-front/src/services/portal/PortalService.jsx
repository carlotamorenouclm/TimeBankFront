import { apiRequest } from '../api/ApiClient';

export const getPortalSummary = () => apiRequest('/portal/summary');

export const getDashboardServices = () => apiRequest('/portal/dashboard');

export const getHistory = () => apiRequest('/portal/history');

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
