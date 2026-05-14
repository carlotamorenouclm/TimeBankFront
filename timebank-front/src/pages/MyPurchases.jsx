/*
 * Pagina React que compone estado, servicios y componentes de interfaz.
 *
 * Comentarios generados para documentar la intencion de cada bloque principal.
 */
// User purchases view, keeping the same chat flow as history.
import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Form, Modal } from 'react-bootstrap';
import RatingStars from '../components/RatingStars';
import TransactionCard from '../components/TransactionCard';
import {
  getChatMessages,
  getThreadMessages,
  sendChatMessage,
  sendThreadMessage,
} from '../services/chat/ChatService';
import {
  completeRequest,
  getHistory,
  getTransactionReviews,
  markHistoryNotificationsRead,
  submitReview,
} from '../services/portal/PortalService';
import { getAuthenticatedUserId } from '../utils/AuthHelpers';

// Renderiza la pantalla MyPurchases y coordina sus datos de vista.
const MyPurchases = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatDraft, setChatDraft] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isChatSaving, setIsChatSaving] = useState(false);
  const [chatError, setChatError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [completingId, setCompletingId] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewTransaction, setReviewTransaction] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: '5', comment: '' });
  const [reviewError, setReviewError] = useState('');
  const [isReviewSaving, setIsReviewSaving] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [showReviewSuccessModal, setShowReviewSuccessModal] = useState(false);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [reviewsTransaction, setReviewsTransaction] = useState(null);
  const [transactionReviews, setTransactionReviews] = useState([]);
  const [isReviewsLoading, setIsReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState('');

  useEffect(() => {
    // Renderiza la pantalla loadHistory y coordina sus datos de vista.
    const loadHistory = async () => {
      try {
        setIsLoading(true);
        setError('');

        const historyData = await getHistory();
        const items = historyData?.transactions || [];
        setTransactions(items.filter((transaction) => transaction.type === 'Purchase'));
        await markHistoryNotificationsRead('Purchase');
        window.dispatchEvent(new Event('portal-summary-refresh'));
      } catch (loadError) {
        setError(loadError.message || 'Error loading history');
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, []);

  useEffect(() => {
    if (!showChatModal || (!selectedTransaction?.request_id && !selectedTransaction?.chat_key)) {
      return undefined;
    }

    // Renderiza la pantalla refreshChat y coordina sus datos de vista.
    const refreshChat = async () => {
      try {
        const chatData = selectedTransaction.request_id
          ? await getChatMessages(selectedTransaction.request_id)
          : await getThreadMessages(selectedTransaction.chat_key);
        setChatMessages(chatData?.messages || []);
        window.dispatchEvent(new Event('portal-summary-refresh'));
      } catch {
        // Keep the current conversation visible if one background refresh fails.
      }
    };

    const intervalId = window.setInterval(refreshChat, 3000);
    return () => window.clearInterval(intervalId);
  }, [showChatModal, selectedTransaction?.chat_key, selectedTransaction?.request_id]);

  // Renderiza la pantalla clearUnreadCount y coordina sus datos de vista.
  const clearUnreadCount = (transactionId) => {
    setTransactions((prev) =>
      prev.map((transaction) =>
        transaction.id === transactionId
          ? { ...transaction, unread_count: 0 }
          : transaction,
      ),
    );
  };

  // Renderiza la pantalla openChatModal y coordina sus datos de vista.
  const openChatModal = async (transaction) => {
    setSelectedTransaction(transaction);
    setChatDraft('');
    setChatMessages([]);
    setChatError('');
    setShowChatModal(true);

    if (!transaction.request_id && !transaction.chat_key) {
      setChatError('This transaction does not have a chat linked yet.');
      return;
    }

    try {
      setIsChatLoading(true);
      const chatData = transaction.request_id
        ? await getChatMessages(transaction.request_id)
        : await getThreadMessages(transaction.chat_key);
      setChatMessages(chatData?.messages || []);
      clearUnreadCount(transaction.id);
      window.dispatchEvent(new Event('portal-summary-refresh'));
    } catch (loadError) {
      setChatError(loadError.message || 'Error loading messages');
    } finally {
      setIsChatLoading(false);
    }
  };

  // Renderiza la pantalla openReviewModal y coordina sus datos de vista.
  const openReviewModal = (transaction) => {
    setReviewTransaction(transaction);
    setReviewForm({ rating: '5', comment: '' });
    setReviewError('');
    setReviewSuccess('');
    setShowReviewSuccessModal(false);
    setShowReviewModal(true);
  };

  // Renderiza la pantalla closeReviewModal y coordina sus datos de vista.
  const closeReviewModal = () => {
    setShowReviewModal(false);
    setReviewTransaction(null);
    setReviewForm({ rating: '5', comment: '' });
    setReviewError('');
  };

  // Renderiza la pantalla openReviewsModal y coordina sus datos de vista.
  const openReviewsModal = async (transaction) => {
    setReviewsTransaction(transaction);
    setTransactionReviews([]);
    setReviewsError('');
    setShowReviewsModal(true);

    try {
      setIsReviewsLoading(true);
      const response = await getTransactionReviews(transaction.id);
      const reviews = Array.isArray(response) ? response : response?.reviews || [];
      setTransactionReviews(reviews);
    } catch (loadError) {
      setReviewsError(loadError.message || 'Error loading reviews');
    } finally {
      setIsReviewsLoading(false);
    }
  };

  // Renderiza la pantalla closeReviewsModal y coordina sus datos de vista.
  const closeReviewsModal = () => {
    setShowReviewsModal(false);
    setReviewsTransaction(null);
    setTransactionReviews([]);
    setReviewsError('');
  };

  // Gestiona el evento de usuario y sincroniza el estado necesario.
  const handleComplete = async (transaction) => {
    const requestId = transaction.request_id;
    if (!requestId) {
      setError('Missing request id for this transaction.');
      return;
    }

    try {
      setCompletingId(transaction.id);
      setError('');
      const response = await completeRequest(requestId);
      if (response?.transactions) {
        setTransactions(
          response.transactions.filter((item) => item.type === 'Purchase'),
        );
      } else {
        setTransactions((prev) =>
          prev.map((item) =>
            item.id === transaction.id
              ? { ...item, status: 'completed' }
              : item,
          ),
        );
      }
    } catch (saveError) {
      setError(saveError.message || 'Error completing request');
    } finally {
      setCompletingId(null);
    }
  };

  // Gestiona el evento de usuario y sincroniza el estado necesario.
  const handleSubmitReview = async () => {
    if (!reviewTransaction) return;

    const ratingValue = Number(reviewForm.rating);
    if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
      setReviewError('Rating must be between 1 and 5.');
      return;
    }

    const reviewerId = getAuthenticatedUserId();
    const revieweeId =
      reviewTransaction.other_user_id ||
      reviewTransaction.otherUserId ||
      reviewTransaction.provider_id ||
      reviewTransaction.seller_id ||
      null;

    if (!reviewerId || !revieweeId) {
      setReviewError('Missing user information to submit the review.');
      return;
    }

    try {
      setIsReviewSaving(true);
      setReviewError('');
      await submitReview({
        rating: ratingValue,
        comment: reviewForm.comment.trim(),
        transaction_id: reviewTransaction.id,
      });
      setReviewSuccess('Review submitted successfully.');
      setShowReviewSuccessModal(true);
      closeReviewModal();
    } catch (saveError) {
      setReviewError(saveError.message || 'Error submitting review');
    } finally {
      setIsReviewSaving(false);
    }
  };

  // Renderiza la pantalla closeChatModal y coordina sus datos de vista.
  const closeChatModal = () => {
    setShowChatModal(false);
    setSelectedTransaction(null);
    setChatDraft('');
    setChatMessages([]);
    setChatError('');
  };

  // Gestiona el evento de usuario y sincroniza el estado necesario.
  const handleSendChatMessage = async () => {
    const trimmedMessage = chatDraft.trim();
    if ((!selectedTransaction?.request_id && !selectedTransaction?.chat_key) || !trimmedMessage) {
      return;
    }

    try {
      setIsChatSaving(true);
      setChatError('');
      const chatData = selectedTransaction.request_id
        ? await sendChatMessage(selectedTransaction.request_id, trimmedMessage)
        : await sendThreadMessage(
            selectedTransaction.chat_key,
            trimmedMessage,
            selectedTransaction.other_user_id,
          );
      setChatMessages(chatData?.messages || []);
      setChatDraft('');
    } catch (saveError) {
      setChatError(saveError.message || 'Error sending message');
    } finally {
      setIsChatSaving(false);
    }
  };

  const chatContactName =
    selectedTransaction?.otherUser || selectedTransaction?.other_user || 'User';

  return (
    <>
      {isLoading && <p className="text-muted">Loading history...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!isLoading && !error && (
        <Row className="g-4">
          {transactions.length > 0 ? (
            transactions.map((transaction) => {
              const normalizedStatus = `${transaction.status || ''}`.toLowerCase();

              return (
                <Col xs={12} md={6} lg={4} key={transaction.id}>
                  <TransactionCard
                    transaction={transaction}
                    onChat={openChatModal}
                    onComplete={handleComplete}
                    onReview={openReviewModal}
                    onViewReviews={openReviewsModal}
                    showComplete={normalizedStatus === 'accepted'}
                    showReview={normalizedStatus === 'completed'}
                    showViewReviews={normalizedStatus === 'completed'}
                    completeDisabled={completingId === transaction.id}
                    reviewLabel="Leave review"
                    viewReviewsLabel="Review"
                  />
                </Col>
              );
            })
          ) : (
            <Col xs={12}>
              <div
                className="bg-white shadow-sm text-center p-5"
                style={{ borderRadius: '16px' }}
              >
                <h5 className="fw-bold mb-2">No purchases found</h5>
                <p className="text-muted mb-0">No purchases are available yet.</p>
              </div>
            </Col>
          )}
        </Row>
      )}

      <Modal show={showChatModal} onHide={closeChatModal} centered size="lg">
        <Modal.Body style={{ padding: '2rem', backgroundColor: '#dbe8f7' }}>
          <div className="d-flex justify-content-between align-items-start gap-3 mb-4">
            <div>
              <h4 className="fw-bold mb-1">
                {chatContactName}
                <span className="fw-normal fst-italic" style={{ fontSize: '1rem' }}>
                  {' '}(Request: {selectedTransaction?.service})
                </span>
              </h4>
              <p className="text-muted mb-0">
                {selectedTransaction?.type === 'Purchase'
                  ? 'Chat with the seller about this service.'
                  : 'Chat with the buyer about this request.'}
              </p>
            </div>
            <Button
              variant="outline-danger"
              onClick={closeChatModal}
              aria-label="Close chat"
              className="fw-bold"
            >
              X
            </Button>
          </div>

          <div
            className="bg-white border mb-4 p-3"
            style={{
              borderRadius: '12px',
              height: '260px',
              overflowY: 'auto',
            }}
          >
            {isChatLoading ? (
              <div className="h-100 d-flex align-items-center justify-content-center text-muted text-center">
                Loading messages...
              </div>
            ) : chatMessages.length === 0 ? (
              <div className="h-100 d-flex align-items-center justify-content-center text-muted text-center">
                Start the conversation about this request.
              </div>
            ) : (
              chatMessages.map((message) => (
                <div
                  key={message.id}
                  className="d-flex mb-3"
                  style={{ justifyContent: message.is_mine ? 'flex-end' : 'flex-start' }}
                >
                  <div
                    className="px-3 py-2"
                    style={{
                      maxWidth: '75%',
                      borderRadius: '14px',
                      backgroundColor: message.is_mine ? 'var(--blue)' : '#eef4fc',
                      color: message.is_mine ? 'white' : 'var(--deep-blue)',
                    }}
                  >
                    {!message.is_mine && (
                      <div className="fw-semibold mb-1" style={{ fontSize: '0.8rem' }}>
                        {message.sender_name}
                      </div>
                    )}
                    {message.message}
                  </div>
                </div>
              ))
            )}
          </div>

          {chatError && <div className="alert alert-danger">{chatError}</div>}

          <div className="d-flex gap-2">
            <Form.Control
              value={chatDraft}
              onChange={(event) => setChatDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  handleSendChatMessage();
                }
              }}
              placeholder="Write a message"
            />
            <Button
              variant="primary"
              onClick={handleSendChatMessage}
              disabled={isChatSaving || !chatDraft.trim()}
            >
              {isChatSaving ? 'Sending...' : 'Send'}
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={showReviewModal} onHide={closeReviewModal} centered>
        <Modal.Body style={{ padding: '2rem' }}>
          <h4 className="fw-bold mb-4">Leave a review</h4>

          <Form.Group className="mb-3">
            <Form.Label>Rating</Form.Label>
            <RatingStars
              value={reviewForm.rating}
              onChange={(nextValue) =>
                setReviewForm((prev) => ({ ...prev, rating: nextValue }))
              }
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Comment</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={reviewForm.comment}
              onChange={(event) =>
                setReviewForm((prev) => ({ ...prev, comment: event.target.value }))
              }
              placeholder="Share your experience"
            />
          </Form.Group>

          {reviewError && <div className="alert alert-danger">{reviewError}</div>}

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={closeReviewModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmitReview} disabled={isReviewSaving}>
              {isReviewSaving ? 'Saving...' : 'Submit review'}
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={showReviewsModal} onHide={closeReviewsModal} centered>
        <Modal.Body style={{ padding: '2rem' }}>
          <div className="d-flex justify-content-between align-items-start gap-3 mb-4">
            <div>
              <h4 className="fw-bold mb-1">Reviews</h4>
              <p className="text-muted mb-0">
                {reviewsTransaction?.service ? `Service: ${reviewsTransaction.service}` : ''}
              </p>
            </div>
            <Button
              variant="outline-danger"
              onClick={closeReviewsModal}
              aria-label="Close reviews"
              className="fw-bold"
            >
              X
            </Button>
          </div>

          {isReviewsLoading ? (
            <div className="text-center text-muted">Loading reviews...</div>
          ) : transactionReviews.length === 0 ? (
            <div className="text-center text-muted">No reviews yet.</div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {transactionReviews.map((review, index) => {
                const reviewerName =
                  review.reviewer_name ||
                  review.reviewerName ||
                  review.reviewer ||
                  review.author_name ||
                  'User';
                const ratingValue = review.rating ?? review.score ?? 0;
                const commentValue = review.comment || 'No comment provided.';
                const createdAt = review.created_at || review.createdAt || '';

                return (
                  <div
                    key={review.id || `${reviewerName}-${index}`}
                    className="border rounded-3 p-3 bg-white"
                  >
                    <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                      <div className="fw-semibold">{reviewerName}</div>
                      {createdAt && (
                        <div className="text-muted" style={{ fontSize: '0.85rem' }}>
                          {createdAt}
                        </div>
                      )}
                    </div>
                    <div className="mb-2">
                      <RatingStars value={String(ratingValue)} />
                    </div>
                    <div className="text-muted">{commentValue}</div>
                  </div>
                );
              })}
            </div>
          )}

          {reviewsError && <div className="alert alert-danger mt-3">{reviewsError}</div>}
        </Modal.Body>
      </Modal>

      <Modal
        show={showReviewSuccessModal}
        onHide={() => setShowReviewSuccessModal(false)}
        centered
      >
        <Modal.Body style={{ padding: '2rem' }}>
          <h4 className="fw-bold mb-3">Review saved</h4>
          <p className="text-muted mb-4">{reviewSuccess}</p>
          <div className="d-flex justify-content-end">
            <Button variant="primary" onClick={() => setShowReviewSuccessModal(false)}>
              OK
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default MyPurchases;
