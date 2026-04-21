import React from 'react';
import { Badge, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './UserListCard.css';

const UserListCard = ({ user, roleLabel, badgeVariant }) => {
  const navigate = useNavigate();
  const fullName = `${user.firstName} ${user.lastName}`;

  const handleEditUser = () => {
    navigate(`/users/${user.id}/edit`, { state: { user, role: roleLabel } });
  };

  return (
    <Card className="user-list-card h-100 border-0 shadow-sm">
      <Card.Body className="p-4 d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start gap-2 mb-3">
          <Card.Title className="mb-0 fs-5 fw-bold text-primary-emphasis">{fullName}</Card.Title>
          <Badge bg={badgeVariant}>{roleLabel}</Badge>
        </div>

        <Card.Text className="mb-2 text-secondary">{user.email}</Card.Text>
        <Card.Text className="mb-3 text-muted">
          Time tokens: {user.timeTokens ?? 0}
        </Card.Text>

        <Button
          variant="outline-primary"
          size="sm"
          aria-label={`Editar usuario ${fullName}`}
          className="edit-user-button mt-auto align-self-end"
          onClick={handleEditUser}
        ><span>Edit</span></Button>
        
      </Card.Body>
    </Card>
  );
};

export default UserListCard;