// User history view with filters for purchases, sales, or the full timeline.
import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Form, Modal } from 'react-bootstrap';
import TransactionCard from '../components/TransactionCard';
import {
  getChatMessages,
  getThreadMessages,
  sendChatMessage,
  sendThreadMessage,
} from '../services/chat/ChatService';
import { getHistory } from '../services/portal/PortalService';

const History = () => {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatDraft, setChatDraft] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isChatSaving, setIsChatSaving] = useState(false);
  const [chatError, setChatError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setIsLoading(true);
        setError('');

        const historyData = await getHistory();
        setTransactions(historyData?.transactions || []);
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

    const refreshChat = async () => {
      try {
        const chatData = selectedTransaction.request_id
          ? await getChatMessages(selectedTransaction.request_id)
          : await getThreadMessages(selectedTransaction.chat_key);
        setChatMessages(chatData?.messages || []);
      } catch {
        // Keep the current conversation visible if one background refresh fails.
      }
    };

    const intervalId = window.setInterval(refreshChat, 3000);
    return () => window.clearInterval(intervalId);
  }, [showChatModal, selectedTransaction?.chat_key, selectedTransaction?.request_id]);

  const filteredTransactions = transactions.filter((transaction) => {
    if (filter === 'purchases') return transaction.type === 'Purchase';
    if (filter === 'sales') return transaction.type === 'Sale';
    return true;
  });

  const clearUnreadCount = (transactionId) => {
    setTransactions((prev) =>
      prev.map((transaction) =>
        transaction.id === transactionId
          ? { ...transaction, unread_count: 0 }
          : transaction,
      ),
    );
  };

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
    } catch (loadError) {
      setChatError(loadError.message || 'Error loading messages');
    } finally {
      setIsChatLoading(false);
    }
  };

  const closeChatModal = () => {
    setShowChatModal(false);
    setSelectedTransaction(null);
    setChatDraft('');
    setChatMessages([]);
    setChatError('');
  };

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
      <div className="mb-4">
        <div className="d-flex gap-3">
          <Button
            variant={filter === 'purchases' ? 'primary' : 'outline-primary'}
            onClick={() => setFilter('purchases')}
          >
            Purchases
          </Button>

          <Button
            variant={filter === 'sales' ? 'primary' : 'outline-primary'}
            onClick={() => setFilter('sales')}
          >
            Sales
          </Button>

          <Button
            variant={filter === 'all' ? 'primary' : 'outline-primary'}
            onClick={() => setFilter('all')}
          >
            All
          </Button>
        </div>
      </div>

      {isLoading && <p className="text-muted">Loading history...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!isLoading && !error && (
        <Row className="g-4">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => (
              <Col xs={12} md={6} lg={4} key={transaction.id}>
                <TransactionCard transaction={transaction} onChat={openChatModal} />
              </Col>
            ))
          ) : (
            <Col xs={12}>
              <div
                className="bg-white shadow-sm text-center p-5"
                style={{ borderRadius: '16px' }}
              >
                <h5 className="fw-bold mb-2">No transactions found</h5>
                <p className="text-muted mb-0">
                  No transactions match the selected filter.
                </p>
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
    </>
  );
};

export default History;
