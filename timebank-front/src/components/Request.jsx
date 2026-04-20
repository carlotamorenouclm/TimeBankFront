import React from 'react';
import { Card, Button } from 'react-bootstrap';

const Request = ({ request, onAccept, onReject }) => {
  return (
    <Card
      className="border-0 shadow-sm w-100"
      style={{
        overflow: 'hidden',
        borderRadius: '24px',
        backgroundColor: '#dbe8f7',
      }}
    >
      <div className="d-flex flex-column flex-md-row">
        <div
          style={{
            width: '280px',
            minWidth: '280px',
            height: '210px',
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          <img
            src={request.image}
            alt={request.service}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>

        <Card.Body className="p-4">
          <h3 className="fw-bold mb-3" style={{ color: '#0b2c6b' }}>
            {request.service}
          </h3>

          <p className="mb-2">{request.description}</p>

          <p className="mb-1 text-muted">
            <strong>Request:</strong> {request.date}
          </p>

          <p className="mb-1 text-muted">
            <strong>Address:</strong> {request.address}
          </p>

          <p className="mb-0 text-muted">
            <strong>Message:</strong> {request.message}
          </p>
        </Card.Body>
      </div>

      <div
        style={{
          backgroundColor: '#c5d6ec',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        <div
          className="fw-bold"
          style={{
            color: '#0b2c6b',
            fontSize: '1.25rem',
          }}
        >
          + {request.price} coins
        </div>

        <div className="d-flex gap-2">
          <Button
            variant="success"
            onClick={() => onAccept(request)}
            style={{
              borderRadius: '999px',
              padding: '10px 22px',
              fontWeight: '600',
            }}
          >
            Accept
          </Button>

          <Button
            variant="danger"
            onClick={() => onReject(request)}
            style={{
              borderRadius: '999px',
              padding: '10px 22px',
              fontWeight: '600',
            }}
          >
            Reject
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default Request;