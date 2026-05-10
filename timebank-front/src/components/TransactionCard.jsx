// Individual card used to render one movement in the exchange history.
import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';

const TransactionCard = ({
  transaction,
  onChat,
  onComplete,
  onReview,
  showComplete,
  showReview,
  completeDisabled,
}) => {
  const otherUser = transaction.otherUser || transaction.other_user || '-';
  const normalizedStatus = `${transaction.status || ''}`.toLowerCase();

  const getStatusBadge = (status) => {
    const label = status ? status.charAt(0).toUpperCase() + status.slice(1) : '-';

    switch (status) {
      case 'completed':
        return <Badge bg="success">{label}</Badge>;
      case 'pending':
        return (
          <Badge bg="warning" text="dark">
            {label}
          </Badge>
        );
      case 'cancelled':
        return <Badge bg="danger">{label}</Badge>;
      case 'accepted':
        return <Badge bg="primary">{label}</Badge>;
      default:
        return <Badge bg="secondary">{label}</Badge>;
    }
  };

  const amountLabel = `${transaction.amount > 0 ? '+' : ''}${transaction.amount} coins`;

  return (
    <Card
      className="border-0 shadow-sm h-100"
      style={{
        borderRadius: '16px',
        overflow: 'hidden',
      }}
    >
      <Card.Body className="p-4">
        <div className="d-flex flex-column justify-content-between h-100">
          <div>
            <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
              <h5 className="fw-bold mb-0">{transaction.service}</h5>
              {getStatusBadge(normalizedStatus)}
              {transaction.unread_count > 0 && (
                <span
                  className="d-inline-flex align-items-center justify-content-center fw-bold"
                  aria-label={`${transaction.unread_count} unread messages`}
                  style={{
                    minWidth: '24px',
                    height: '24px',
                    padding: '0 7px',
                    borderRadius: '999px',
                    backgroundColor: 'var(--blue)',
                    color: 'white',
                    fontSize: '0.8rem',
                    lineHeight: 1,
                  }}
                >
                  {transaction.unread_count}
                </span>
              )}
            </div>

            <p className="mb-1 text-muted">
              <strong>User:</strong> {otherUser}
            </p>

            <p className="mb-3 text-muted">
              <strong>Date:</strong> {transaction.date}
            </p>

            {transaction.address && (
              <p className="mb-3 text-muted">
                <strong>Address:</strong> {transaction.address}
              </p>
            )}

            {transaction.clarification && (
              <p className="mb-3 text-muted">
                <strong>Provider note:</strong> {transaction.clarification}
              </p>
            )}
          </div>

          <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap">
            <div
              className="fw-bold fs-5"
              style={{
                color: transaction.amount >= 0 ? '#198754' : '#dc3545',
              }}
            >
              {amountLabel}
            </div>

            <div className="d-flex gap-2 flex-wrap">
              {showComplete && (
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => onComplete?.(transaction)}
                  disabled={completeDisabled}
                >
                  Mark completed
                </Button>
              )}
              {showReview && (
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => onReview?.(transaction)}
                >
                  Review
                </Button>
              )}
              <Button
                variant="primary"
                size="sm"
                onClick={() => onChat?.(transaction)}
              >
                Chat
              </Button>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TransactionCard;
