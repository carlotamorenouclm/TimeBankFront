// Tarjeta reutilizable para solicitudes recibidas en Inbox, pendientes o ya procesadas.
import React from 'react';
import { Card, Row, Col, Button, Badge } from 'react-bootstrap';

const statusConfig = {
  pending: {
    label: 'Pending',
    badgeBg: 'warning',
    badgeText: 'dark',
    background: '#dbe8f7',
    footer: '#c5d6ec',
  },
  accepted: {
    label: 'Accepted',
    badgeBg: 'success',
    badgeText: undefined,
    background: '#e8f5e9',
    footer: '#d7edd9',
  },
  rejected: {
    label: 'Rejected',
    badgeBg: 'danger',
    badgeText: undefined,
    background: '#fdeaea',
    footer: '#f7d6d6',
  },
};

const Request = ({ request, onAccept, onReject }) => {
  const isPending = request.status === 'pending';
  const config = statusConfig[request.status] || statusConfig.pending;

  return (
    <Card
      className="shadow-sm border-0"
      style={{
        borderRadius: '24px',
        overflow: 'hidden',
        backgroundColor: config.background,
      }}
    >
      <Row className="g-0 align-items-stretch">
        <Col xs={12} md={3} style={{ minHeight: '210px' }}>
          <img
            src={request.image}
            alt={request.service}
            className="w-100 h-100"
            style={{
              objectFit: 'cover',
              borderTopLeftRadius: '24px',
              borderBottomLeftRadius: '24px',
            }}
          />
        </Col>

        <Col xs={12} md={9}>
          <Card.Body className="h-100 d-flex flex-column flex-md-row justify-content-between gap-4 p-4">
            <div>
              <div className="d-flex align-items-center gap-2 mb-3 flex-wrap">
                <Card.Title
                  className="fw-bold mb-0"
                  style={{ color: 'var(--deep-blue)', fontSize: '1.35rem' }}
                >
                  {request.service}
                </Card.Title>

                <Badge bg={config.badgeBg} text={config.badgeText}>
                  {config.label}
                </Badge>
              </div>

              <Card.Text className="mb-2 text-muted">
                <strong>From:</strong> {request.requester_name}
              </Card.Text>

              <Card.Text className="mb-2">{request.description}</Card.Text>

              <Card.Text className="mb-1 small text-muted">
                <strong>Request:</strong> {request.date}
              </Card.Text>

              <Card.Text className="mb-1 small text-muted">
                <strong>Address:</strong> {request.address}
              </Card.Text>

              <Card.Text className="mb-2 small text-muted">
                <strong>Message:</strong> {request.message || 'No message'}
              </Card.Text>

              {request.clarification && (
                <Card.Text className="mb-1 small text-muted">
                  <strong>Clarification:</strong> {request.clarification}
                </Card.Text>
              )}

              {request.reject_reason && (
                <Card.Text className="mb-1 small text-muted">
                  <strong>Reject reason:</strong> {request.reject_reason}
                </Card.Text>
              )}
            </div>

            <div className="d-flex flex-column justify-content-between align-items-md-end">
              <div
                className="fw-semibold mb-4"
                style={{
                  fontSize: '2rem',
                  color: 'var(--deep-blue)',
                }}
              >
                + {request.price} coins
              </div>

              {isPending ? (
                <div className="d-flex gap-2 flex-wrap justify-content-md-end">
                  <Button
                    variant="success"
                    onClick={() => onAccept?.(request)}
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
                    onClick={() => onReject?.(request)}
                    style={{
                      borderRadius: '999px',
                      padding: '10px 22px',
                      fontWeight: '600',
                    }}
                  >
                    Reject
                  </Button>
                </div>
              ) : (
                <div className="fw-semibold" style={{ color: 'var(--deep-blue)' }}>
                  Request already processed
                </div>
              )}
            </div>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
};

export default Request;
