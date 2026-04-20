import React from 'react';
import { Badge, Card } from 'react-bootstrap';
import './UserListCard.css';

const UserListCard = ({ user, roleLabel, badgeVariant }) => {
  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <Card className="user-list-card h-100 border-0 shadow-sm">
      <Card.Body className="p-4 d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start gap-2 mb-3">
          <Card.Title className="mb-0 fs-5 fw-bold text-primary-emphasis">{fullName}</Card.Title>
          <Badge bg={badgeVariant}>{roleLabel}</Badge>
        </div>
        <Card.Text className="mb-0 text-secondary">{user.email}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default UserListCard;