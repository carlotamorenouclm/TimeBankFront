// Visual card for each service shown in the user catalog.

import React from 'react';
import { Badge, Card, Row, Col, Button } from 'react-bootstrap';
import ButtonPill from './ButtonPill';
import RatingStars from './RatingStars';


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
  overallRating = null,
  onSeeReviews = null,
  showSeeReviews = false,
  statusBadge = null,
}) => {
  const formattedRating =
    overallRating !== null && overallRating !== undefined
      ? Number(overallRating).toFixed(1)
      : null;

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
        <Col xs={12} md={3} style={{ minHeight: '200px', backgroundColor: '#eef3f8' }}>
          {image && (
            <img
              src={image}
              alt={title}
              className="w-100 h-100"
              style={{
                objectFit: 'cover',
                borderTopLeftRadius: '24px',
                borderBottomLeftRadius: '24px'
              }}
            />
          )}
        </Col>

        {/* INFO */}
        <Col xs={12} md={9}>
          <Card.Body className="h-100 d-flex flex-column flex-md-row justify-content-between gap-4 p-4">
            <div className="flex-grow-1">
              <div className="d-flex align-items-center gap-2 flex-wrap mb-3">
                <Card.Title
                  className="fw-bold mb-0"
                  style={{ color: 'var(--deep-blue)', fontSize: '1.35rem' }}
                >
                  {title}
                </Card.Title>
                {statusBadge && (
                  <Badge bg={statusBadge.variant || 'secondary'}>
                    {statusBadge.label}
                  </Badge>
                )}
              </div>

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

              {/* Overall Rating Stars */}
              {formattedRating !== null && (
                <div className="my-2 d-flex align-items-center flex-wrap gap-2">
                  <span className="fw-semibold">Average rating:</span>
                  <RatingStars value={overallRating} onChange={null} size="1.35rem" />
                  <span className="small text-muted">{formattedRating}/5</span>
                </div>
              )}

              {/* See Reviews Button */}
              {showSeeReviews && (
                <div className="mb-2">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={onSeeReviews}
                  >
                    See Reviews
                  </Button>
                </div>
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
