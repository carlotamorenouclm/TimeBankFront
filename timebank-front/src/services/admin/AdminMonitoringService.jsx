// Admin monitoring services for user wallet and transaction history.
import { apiRequest } from '../api/ApiClient';

export const getAdminWalletHistory = (userId) => {
  if (!userId) {
    throw new Error('Missing user id for wallet history');
  }

  return apiRequest(`/admins/wallet/history?user_id=${encodeURIComponent(userId)}`);
};

export const getAdminTransactionHistory = (userId) => {
  if (!userId) {
    throw new Error('Missing user id for transaction history');
  }

  return apiRequest(`/admins/transaction/history?user_id=${encodeURIComponent(userId)}`);
};

export const getAdminUserReviews = (userId) => {
  if (!userId) {
    throw new Error('Missing user id for reviews');
  }

  return apiRequest(`/admins/reviews?user_id=${encodeURIComponent(userId)}`);
};

export const getAdminUserServices = (userId) => {
  if (!userId) {
    throw new Error('Missing user id for services');
  }

  return apiRequest(`/admins/services?user_id=${encodeURIComponent(userId)}`);
};

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

export const deleteAdminService = (serviceId) => {
  if (!serviceId) {
    throw new Error('Missing service id');
  }

  return apiRequest(`/admins/services/${serviceId}`, {
    method: 'DELETE',
  });
};

export const deleteAdminReview = (reviewId) => {
  if (!reviewId) {
    throw new Error('Missing review id');
  }

  return apiRequest(`/admins/reviews/${reviewId}`, {
    method: 'DELETE',
  });
};
