// Chat API calls for request conversations.
import { apiRequest } from '../api/ApiClient';

export const getChatMessages = (requestId) =>
  apiRequest(`/chat/requests/${requestId}/messages`);

export const sendChatMessage = (requestId, message) =>
  apiRequest(`/chat/requests/${requestId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ message }),
  });

export const getThreadMessages = (threadKey) =>
  apiRequest(`/chat/threads/${threadKey}/messages`);

export const sendThreadMessage = (threadKey, message, receiverId) =>
  apiRequest(`/chat/threads/${threadKey}/messages`, {
    method: 'POST',
    body: JSON.stringify({ message, receiver_id: receiverId }),
  });
