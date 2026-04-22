// Visual card for each service shown in the user catalog.
import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import ButtonPill from './ButtonPill';

const ServiceCard = ({
  title,
  description,
  availability,
  location,
  extra,
  price,
  image,
  actionLabel = 'Request',
  onAction,
  actionDisabled = false,
}) => {
  return (
    <Card
      className="shadow-sm border-0"
      style={{
        borderRadius: '24px',
        overflow: 'hidden',
        backgroundColor: '#dbe8f7'
      }}
    >
      <Row className="g-0 align-items-stretch">
        
        {/* IMAGE */}
        <Col xs={12} md={3} style={{ minHeight: '200px' }}>
          <img
            src={image}
            alt={title}
            className="w-100 h-100"
            style={{
              objectFit: 'cover',
              borderTopLeftRadius: '24px',
              borderBottomLeftRadius: '24px'
            }}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x250?text=Service+Image';
            }}
          />
        </Col>

        {/* INFO */}
        <Col xs={12} md={9}>
          <Card.Body className="h-100 d-flex flex-column flex-md-row justify-content-between gap-4 p-4">
            
            <div>
              <Card.Title
                className="fw-bold mb-3"
                style={{ color: 'var(--deep-blue)', fontSize: '1.35rem' }}
              >
                {title}
              </Card.Title>

              <Card.Text className="mb-2">
                {description}
              </Card.Text>

              <Card.Text className="mb-1 small text-muted">
                Availability: {availability}
              </Card.Text>

              {location && (
                <Card.Text className="mb-1 small text-muted">
                  {location}
                </Card.Text>
              )}

              {extra && (
                <Card.Text className="small text-muted">
                  {extra}
                </Card.Text>
              )}
            </div>

            <div className="d-flex flex-column justify-content-between align-items-md-end">
              <div
                className="fw-semibold mb-4"
                style={{
                  fontSize: '2rem',
                  color: 'var(--deep-blue)'
                }}
              >
                {price}
              </div>

              <ButtonPill
                className="px-4"
                onClick={onAction}
                disabled={actionDisabled}
              >
                {actionLabel}
              </ButtonPill>
            </div>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
};

export default ServiceCard;
