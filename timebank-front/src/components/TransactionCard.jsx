import React from 'react';
import { Card, Badge } from 'react-bootstrap';

const TransactionCard = ({ transaction }) => {
  const otherUser = transaction.otherUser || transaction.other_user || '-';

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return <Badge bg="success">{status}</Badge>;
      case 'Pending':
        return (
          <Badge bg="warning" text="dark">
            {status}
          </Badge>
        );
      case 'Cancelled':
        return <Badge bg="danger">{status}</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
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
              {getStatusBadge(transaction.status)}
            </div>

            <p className="mb-1 text-muted">
              <strong>Type:</strong> {transaction.type}
            </p>

            <p className="mb-1 text-muted">
              <strong>User:</strong> {otherUser}
            </p>

            <p className="mb-3 text-muted">
              <strong>Date:</strong> {transaction.date}
            </p>
          </div>

          <div
            className="fw-bold fs-5"
            style={{
              color: transaction.amount >= 0 ? '#198754' : '#dc3545',
            }}
          >
            {amountLabel}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TransactionCard;
