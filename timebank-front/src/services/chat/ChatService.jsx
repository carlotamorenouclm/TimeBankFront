/*
 * Contiene logica de negocio reutilizable entre rutas y consultas.
 *
 * Comentarios generados para documentar la intencion de cada bloque principal.
 */
// Chat API calls for request conversations.
import { apiRequest } from '../api/ApiClient';

// Ejecuta la operacion de get chat messages contra la API.
export const getChatMessages = (requestId) =>
  apiRequest(`/chat/requests/${requestId}/messages`);

// Ejecuta la operacion de send chat message contra la API.
export const sendChatMessage = (requestId, message) =>
  apiRequest(`/chat/requests/${requestId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ message }),
  });

// Ejecuta la operacion de get thread messages contra la API.
export const getThreadMessages = (threadKey) =>
  apiRequest(`/chat/threads/${threadKey}/messages`);

// Ejecuta la operacion de send thread message contra la API.
export const sendThreadMessage = (threadKey, message, receiverId) =>
  apiRequest(`/chat/threads/${threadKey}/messages`, {
    method: 'POST',
    body: JSON.stringify({ message, receiver_id: receiverId }),
  });
