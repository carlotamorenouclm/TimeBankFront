import React, { useMemo, useState } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import NavbarCustom from '../components/NavbarCustom';
import { updateRoleTimeTokens, updateUserInfo } from '../services/admin/UsersService';
import {
  normalizeRole,
  normalizeText,
  normalizeTimeTokens,
  validateEditUserInput
} from '../utils/Normalized';

const EditUser = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = useParams();

  const selectedUser = useMemo(() => location.state?.user || null, [location.state]);
  const initialRole = useMemo(() => normalizeRole(location.state?.role || 'User'), [location.state]);
  const initialTimeTokens = useMemo(() => normalizeTimeTokens(selectedUser?.timeTokens ?? 0), [selectedUser]);
  const initialFirstName = useMemo(() => normalizeText(selectedUser?.firstName), [selectedUser]);
  const initialLastName = useMemo(() => normalizeText(selectedUser?.lastName), [selectedUser]);

  const [formData, setFormData] = useState({
    firstName: selectedUser?.firstName || '',
    lastName: selectedUser?.lastName || '',
    email: selectedUser?.email || '',
    role: initialRole,
    timeTokens: initialTimeTokens
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const hasError = Boolean(errorMessage);
  const hasSuccess = Boolean(statusMessage) && !hasError;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatusMessage('');
    setErrorMessage('');

    const normalizedCurrentRole = normalizeRole(formData.role);
    const normalizedCurrentFirstName = normalizeText(formData.firstName);
    const normalizedCurrentLastName = normalizeText(formData.lastName);
    const normalizedCurrentTokens = normalizeTimeTokens(formData.timeTokens);

    const validationError = validateEditUserInput({
      firstName: normalizedCurrentFirstName, lastName: normalizedCurrentLastName, timeTokens: normalizedCurrentTokens});

    const roleChanged = normalizedCurrentRole !== initialRole;
    const tokensChanged = normalizedCurrentTokens !== initialTimeTokens;
    const firstNameChanged = normalizedCurrentFirstName !== initialFirstName;
    const lastNameChanged = normalizedCurrentLastName !== initialLastName;
    const userInfoChanged = firstNameChanged || lastNameChanged;

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    if (!roleChanged && !tokensChanged && !userInfoChanged) {
      setStatusMessage('No hubo cambios para guardar.');
      return;
    }

    try {
      setIsSaving(true);
      const token = localStorage.getItem('access_token');

      if (userInfoChanged) {
        await updateUserInfo({
          userId,
          firstName: normalizedCurrentFirstName,
          lastName: normalizedCurrentLastName,
          accessToken: token
        });
      }

      if (roleChanged || tokensChanged) {
        await updateRoleTimeTokens({
          userId,
          newRole: normalizedCurrentRole,
          newTimeTokens: normalizedCurrentTokens,
          accessToken: token
        });
      }

      setStatusMessage('Cambios guardados correctamente.');
    } catch (error) {
      setErrorMessage(error.message || 'No se pudo actualizar el usuario.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fc' }}>
      <NavbarCustom />
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={10} lg={7}>
            <Card
              className="border-0"
              style={{
                transition: 'box-shadow 0.25s ease',
                boxShadow: hasError
                  ? '0 0 0 0.2rem rgba(220, 53, 69, 0.25), 0 0.75rem 1.25rem rgba(220, 53, 69, 0.2)'
                  : hasSuccess
                    ? '0 0 0 0.2rem rgba(25, 135, 84, 0.25), 0 0.75rem 1.25rem rgba(25, 135, 84, 0.2)'
                    : '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)'
              }}
            >
              <Card.Body className="p-4 p-md-5">
                <h1 className="fw-bold mb-2">Editar usuario</h1>
                <p className="text-muted mb-4">
                  ID del usuario: <strong>{userId}</strong>
                </p>

                <Form onSubmit={handleSubmit}>

                  <Form.Group className="mb-3" controlId="firstName">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                      type="text" name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="lastName">
                    <Form.Label>Apellido</Form.Label>
                    <Form.Control
                      type="text" name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email" name="email"
                      value={formData.email}
                      readOnly
                      disabled
                    />
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="role">
                    <Form.Label>Rol</Form.Label>
                    <Form.Select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                      >
                        <option value="ADMIN">Admin</option>
                        <option value="USER">User</option>
                      </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="timeTokens">
                    <Form.Label>Time Tokens</Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      step="1"
                      name="timeTokens"
                      value={formData.timeTokens}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <div className="d-flex flex-column gap-2">
                      <div className="d-flex flex-column">
                        {statusMessage && <span className="text-success">{statusMessage}</span>}
                        {errorMessage && <span className="text-danger">{errorMessage}</span>}
                      </div>

                    <div className="d-flex flex-wrap gap-2">
                      <Button type="submit" variant="primary" disabled={isSaving}>
                        {isSaving ? 'Keeping...' : 'Keep changes'}
                      </Button>
                      <Button type="button" variant="outline-secondary" onClick={() => navigate('/dashboardadmin')}>
                        Go back
                      </Button>
                    </div>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default EditUser;
