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

export const deleteAdminReview = (reviewId) => {
  if (!reviewId) {
    throw new Error('Missing review id');
  }

  return apiRequest(`/admins/reviews/${reviewId}`, {
    method: 'DELETE',
  });
};
