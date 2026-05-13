import React from 'react';
import { Badge } from 'react-bootstrap';

const getStatusBadge = (status) => {
  const normalized = `${status || ''}`.toLowerCase();
  const label = status ? status.charAt(0).toUpperCase() + status.slice(1) : '-';

  switch (normalized) {
    case 'completed':
      return <Badge bg="success">{label}</Badge>;
    case 'pending':
      return (
        <Badge bg="warning" text="dark">
          {label}
        </Badge>
      );
    case 'cancelled':
    case 'rejected':
      return <Badge bg="danger">{label}</Badge>;
    case 'accepted':
      return <Badge bg="primary">{label}</Badge>;
    default:
      return <Badge bg="secondary">{label}</Badge>;
  }
};

export default getStatusBadge;
