import React, { useMemo, useState } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import NavbarCustom from '../components/NavbarCustom';
import { updateRoleTimeTokens } from '../services/admin/UsersService';

const EditUser = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = useParams();

  const selectedUser = useMemo(() => location.state?.user || null, [location.state]);
  const initialRole = useMemo(() => location.state?.role || 'User', [location.state]);
  const initialTimeTokens = useMemo(() => Number(selectedUser?.timeTokens ?? 0), [selectedUser]);

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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const normalizeRole = (roleValue) => String(roleValue || '').trim().toUpperCase();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatusMessage('');
    setErrorMessage('');

    const normalizedInitialRole = normalizeRole(initialRole);
    const normalizedCurrentRole = normalizeRole(formData.role);
    const parsedTokens = Number(formData.timeTokens);
    const normalizedCurrentTokens = Number.isFinite(parsedTokens) ? Math.floor(parsedTokens) : 0;

    if (normalizedCurrentTokens < 0) {
      setErrorMessage('Time tokens no puede ser negativo.');
      return;
    }

    const roleChanged = normalizedCurrentRole !== normalizedInitialRole;
    const tokensChanged = normalizedCurrentTokens !== initialTimeTokens;

    if (!roleChanged && !tokensChanged) {
      setStatusMessage('No hubo cambios en rol ni en time tokens.');
      return;
    }

    try {
      setIsSaving(true);
      const token = localStorage.getItem('access_token');

      await updateRoleTimeTokens({
        userId,
        newRole: normalizedCurrentRole,
        newTimeTokens: normalizedCurrentTokens,
        accessToken: token
      });

      setStatusMessage('Rol o time tokens actualizado correctamente.');
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
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4 p-md-5">
                <h1 className="fw-bold mb-2">Editar usuario</h1>
                <p className="text-muted mb-4">
                  ID del usuario: <strong>{userId}</strong>
                </p>

                <Form onSubmit={handleSubmit}>
                  {statusMessage && <p className="text-success">{statusMessage}</p>}
                  {errorMessage && <p className="text-danger">{errorMessage}</p>}

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
                        <option value="Admin">Admin</option>
                        <option value="User">User</option>
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

                  <div className="d-flex flex-wrap gap-2">
                    <Button type="submit" variant="primary" disabled={isSaving}>
                      {isSaving ? 'Guardando...' : 'Guardar cambios'}
                    </Button>
                    <Button type="button" variant="outline-secondary" onClick={() => navigate('/dashboardadmin')}>
                      Volver al panel
                    </Button>
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
