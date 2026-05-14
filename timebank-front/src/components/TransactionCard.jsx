// Individual card used to render one movement in the exchange history.
import React from 'react';
import { Card, Button } from 'react-bootstrap';
import getStatusBadge from '../utils/getStatusBadge';

const TransactionCard = ({
  transaction,
  onChat,
  onComplete,
  onReview,
  onViewReviews,
  showComplete,
  showReview,
  showViewReviews,
  completeDisabled,
}) => {
  const otherUser = transaction.otherUser || transaction.other_user || '-';
  const normalizedStatus = `${transaction.status || ''}`.toLowerCase();


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

            {transaction.reject_reason && (
              <p className="mb-3 text-muted">
                <strong>Reject reason:</strong> {transaction.reject_reason}
              </p>
            )}
          </div>

          <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap">
            <div
              className="fw-bold fs-5"
              style={{
                color: transaction.amount > 0 ? '#198754' : '#dc3545',
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
                  Leave a review
                </Button>
              )}
              {showViewReviews && (
                <>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => onViewReviews?.(transaction)}
                  >
                    See Review
                  </Button>
                  {transaction.has_unseen_review && (
                    <span
                      className="d-inline-flex align-items-center fw-bold fst-italic text-danger"
                      aria-label="New review received"
                    >
                      Rated ‼️
                    </span>
                  )}
                </>
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
