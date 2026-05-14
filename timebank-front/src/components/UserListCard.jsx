// Admin panel card that summarizes one user and opens the edit page.
import React from 'react';
import { Badge, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './UserListCard.css';

const UserListCard = ({ user, roleLabel, badgeVariant, onToggleActive, isToggling, onDelete, isDeleting }) => {
  const navigate = useNavigate();
  const fullName = `${user.firstName} ${user.lastName}`;
  const isActive = user?.isActive ?? true;
  const toggleLabel = isActive ? 'Deactivate' : 'Activate';
  const toggleVariant = isActive ? '' : 'outline-success';
  const toggleClassName = isActive ? 'btn-outline-orange' : '';

  const handleEditUser = () => {
    navigate(`/users/${user.id}/edit`, { state: { user, role: roleLabel } });
  };

  const handleMonitoring = () => {
    navigate(`/users/${user.id}/monitoring`, { state: { user, role: roleLabel } });
  };

  return (
    <Card className="user-list-card h-100 border-0 shadow-sm">
      <Card.Body className="p-4 d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start gap-2 mb-3">
          <Card.Title className="mb-0 fs-5 fw-bold text-primary-emphasis">{fullName}</Card.Title>
          <Badge bg={badgeVariant}>{roleLabel}</Badge>
        </div>

        <Card.Text className="mb-2 text-secondary">{user.email}</Card.Text>
        <div className="mt-auto d-flex flex-wrap gap-2 align-self-end">
          <Button
            variant="outline-secondary"
            size="sm"
            aria-label={`Monitor user ${fullName}`}
            onClick={handleMonitoring}
          >
            Monitoring
          </Button>
          <Button
            variant="outline-primary"
            size="sm"
            aria-label={`Edit user ${fullName}`}
            className="edit-user-button"
            onClick={handleEditUser}
          >
            <span>Edit</span>
          </Button>
          <Button
            variant={toggleVariant}
            className={toggleClassName}
            size="sm"
            aria-label={`${toggleLabel} user ${fullName}`}
            disabled={isToggling}
            onClick={() => onToggleActive?.(user.id, !isActive)}
          >
            {isToggling ? 'Processing...' : toggleLabel}
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            aria-label={`Delete user ${fullName}`}
            disabled={isDeleting}
            onClick={() => onDelete?.(user)}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default UserListCard;
