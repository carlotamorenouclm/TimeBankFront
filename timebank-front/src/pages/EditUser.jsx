/*
 * Pagina React que compone estado, servicios y componentes de interfaz.
 *
 * Comentarios generados para documentar la intencion de cada bloque principal.
 */
// Admin panel form used to edit personal data and role.
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import NavbarCustom from '../components/NavbarCustom';
import {
  getUserWallet,
  updateUserCoins,
  updateUserRole,
  updateUserInfo
} from '../services/admin/UsersService';
import {
  normalizeRole,
  normalizeText,
  validateEditUserInput
} from '../utils/Normalized';

// Renderiza la pantalla EditUser y coordina sus datos de vista.
const EditUser = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = useParams();

  const selectedUser = useMemo(() => location.state?.user || null, [location.state]);
  const initialRole = useMemo(() => normalizeRole(location.state?.role || 'User'), [location.state]);
  const sourceView = location.state?.role === 'Admin' ? 'admins' : 'users';
  const initialFirstName = useMemo(() => normalizeText(selectedUser?.firstName), [selectedUser]);
  const initialLastName = useMemo(() => normalizeText(selectedUser?.lastName), [selectedUser]);

  const [formData, setFormData] = useState({
    firstName: selectedUser?.firstName || '',
    lastName: selectedUser?.lastName || '',
    email: selectedUser?.email || '',
    role: initialRole,
    coins: ''
  });
  const [initialCoins, setInitialCoins] = useState(null);
  
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const hasError = Boolean(errorMessage);
  const hasSuccess = Boolean(statusMessage) && !hasError;

  useEffect(() => {
    // Renderiza la pantalla loadWallet y coordina sus datos de vista.
    const loadWallet = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const wallet = await getUserWallet({ userId, accessToken: token });
        const coins = Number(wallet?.balance ?? 0);
        setInitialCoins(coins);
        setFormData((prev) => ({ ...prev, coins: String(coins) }));
      } catch (error) {
        setErrorMessage(error.message || 'The user wallet could not be loaded.');
      }
    };

    loadWallet();
  }, [userId]);

  // Gestiona el evento de usuario y sincroniza el estado necesario.
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Gestiona el evento de usuario y sincroniza el estado necesario.
  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatusMessage('');
    setErrorMessage('');

    const normalizedCurrentRole = normalizeRole(formData.role);
    const normalizedCurrentFirstName = normalizeText(formData.firstName);
    const normalizedCurrentLastName = normalizeText(formData.lastName);
    const currentCoins = Number(formData.coins);

    const validationError = validateEditUserInput({
      firstName: normalizedCurrentFirstName, lastName: normalizedCurrentLastName});

    const coinsAreInvalid =
      formData.coins === '' || !Number.isInteger(currentCoins) || currentCoins < 0;
    const roleChanged = normalizedCurrentRole !== initialRole;
    const firstNameChanged = normalizedCurrentFirstName !== initialFirstName;
    const lastNameChanged = normalizedCurrentLastName !== initialLastName;
    const coinsChanged = currentCoins !== initialCoins;
    const userInfoChanged = firstNameChanged || lastNameChanged;

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    if (coinsAreInvalid) {
      setErrorMessage('Coins must be a whole number equal to or greater than 0.');
      return;
    }

    if (!roleChanged && !userInfoChanged && !coinsChanged) {
      setStatusMessage('There are no changes to save.');
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

      if (roleChanged) {
        await updateUserRole({
          userId,
          newRole: normalizedCurrentRole,
          accessToken: token
        });
      }

      if (coinsChanged) {
        const wallet = await updateUserCoins({
          userId,
          coins: currentCoins,
          accessToken: token
        });
        const savedCoins = Number(wallet?.balance ?? currentCoins);
        setInitialCoins(savedCoins);
        setFormData((prev) => ({ ...prev, coins: String(savedCoins) }));
      }

      setStatusMessage('Changes saved successfully.');
    } catch (error) {
      setErrorMessage(error.message || 'The user could not be updated.');
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
                <h1 className="fw-bold mb-2">Edit user</h1>
                <p className="text-muted mb-4">
                  User ID: <strong>{userId}</strong>
                </p>

                <Form onSubmit={handleSubmit}>

                  <Form.Group className="mb-3" controlId="firstName">
                    <Form.Label>First name</Form.Label>
                    <Form.Control
                      type="text" name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="lastName">
                    <Form.Label>Last name</Form.Label>
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

                  <Form.Group className="mb-4" controlId="coins">
                    <Form.Label>Coins</Form.Label>
                    <Form.Control
                      type="number"
                      name="coins"
                      min="0"
                      step="1"
                      value={formData.coins}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="role">
                    <Form.Label>Role</Form.Label>
                    <Form.Select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                      >
                        <option value="ADMIN">Admin</option>
                        <option value="USER">User</option>
                      </Form.Select>
                  </Form.Group>

                  <div className="d-flex flex-column gap-2">
                      <div className="d-flex flex-column">
                        {statusMessage && <span className="text-success">{statusMessage}</span>}
                        {errorMessage && <span className="text-danger">{errorMessage}</span>}
                      </div>

                    <div className="d-flex flex-wrap gap-2">
                      <Button type="submit" variant="primary" disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save changes'}
                      </Button>
                      <Button type="button" variant="outline-secondary" onClick={() => navigate(`/dashboardadmin?view=${sourceView}`)}>
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
