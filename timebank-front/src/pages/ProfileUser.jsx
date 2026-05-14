/*
 * Pagina React que compone estado, servicios y componentes de interfaz.
 *
 * Comentarios generados para documentar la intencion de cada bloque principal.
 */
import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Form, Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { avatarOptions, getAvatarImage } from '../constants/avatarOptions';
import {
  changeMyPassword,
  deleteMyAccount,
  getMyProfile,
  updateMyProfile,
} from '../services/portal/PortalService';
import { clearAuthSession } from '../utils/AuthHelpers';

const validatePasswordStrength = (password) => {
  if (password.length < 8) return 'Password must contain at least 8 characters.';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter.';
  if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter.';
  if (!/\d/.test(password)) return 'Password must contain at least one number.';
  if (!/[!@#$%^&*(),.?":{}|<>\-_+=[\]\\/~`]/.test(password)) {
    return 'Password must contain at least one special character.';
  }
  return '';
};

// Renderiza la pantalla ProfileUser y coordina sus datos de vista.
const ProfileUser = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: '',
    surname: '',
    email: '',
    role: 'USER',
    avatar_key: null,
  });
  const [formData, setFormData] = useState({ name: '', surname: '', email: '', avatar_key: '' });
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Renderiza la pantalla loadProfile y coordina sus datos de vista.
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        setError('');
        const me = await getMyProfile();
        setProfile({
          name: me?.name || '',
          surname: me?.surname || '',
          email: me?.email || '',
          role: me?.role || 'USER',
          avatar_key: me?.avatar_key || '',
        });
        setFormData({
          name: me?.name || '',
          surname: me?.surname || '',
          email: me?.email || '',
          avatar_key: me?.avatar_key || '',
        });
      } catch (loadError) {
        setError(loadError.message || 'Error loading profile');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  // Gestiona el evento de usuario y sincroniza el estado necesario.
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Gestiona el evento de usuario y sincroniza el estado necesario.
  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  // Gestiona el evento de usuario y sincroniza el estado necesario.
  const handleSave = async (event) => {
    event.preventDefault();

    try {
      setIsSaving(true);
      setError('');
      setStatusMessage('');
      const updated = await updateMyProfile({
        name: formData.name,
        surname: formData.surname,
        email: formData.email,
        avatar_key: formData.avatar_key || null,
      });
      setProfile((prev) => ({
        ...prev,
        name: updated?.name || '',
        surname: updated?.surname || '',
        email: updated?.email || '',
        avatar_key: updated?.avatar_key || '',
      }));
      setStatusMessage('Profile updated successfully.');
    } catch (saveError) {
      setError(saveError.message || 'Error updating profile');
    } finally {
      setIsSaving(false);
    }
  };

  // Gestiona el evento de usuario y sincroniza el estado necesario.
  const handlePasswordSave = async (event) => {
    event.preventDefault();

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setStatusMessage('');
      setError('The new password and confirmation do not match.');
      return;
    }

    const passwordError = validatePasswordStrength(passwordForm.new_password);
    if (passwordError) {
      setStatusMessage('');
      setError(passwordError);
      return;
    }

    try {
      setIsPasswordSaving(true);
      setError('');
      setStatusMessage('');
      await changeMyPassword({
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
      });
      setPasswordForm({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
      setStatusMessage('Password updated successfully.');
    } catch (saveError) {
      setError(saveError.message || 'Error updating password');
    } finally {
      setIsPasswordSaving(false);
    }
  };

  // Gestiona el evento de usuario y sincroniza el estado necesario.
  const handleDeleteAccount = async () => {
    try {
      setIsSaving(true);
      setError('');
      await deleteMyAccount();
      clearAuthSession();
      navigate('/');
    } catch (deleteError) {
      setError(deleteError.message || 'Error deleting account');
      setIsSaving(false);
      setShowDeleteModal(false);
    }
  };

  const fullName = [profile.name, profile.surname].filter(Boolean).join(' ').trim() || 'User';
  const avatarImage = getAvatarImage(formData.avatar_key || profile.avatar_key);

  return (
    <>
      {error && <div className="alert alert-danger">{error}</div>}
      {statusMessage && <div className="alert alert-success">{statusMessage}</div>}
      {isLoading ? (
        <p className="text-muted">Loading profile...</p>
      ) : (
        <div className="d-grid gap-4">
          <Card className="border-0 shadow-sm" style={{ borderRadius: '18px' }}>
            <Card.Body className="p-4 p-md-5">
              <div className="d-flex align-items-center gap-4 flex-wrap mb-4">
                <div
                  className="rounded-circle bg-white overflow-hidden"
                  style={{
                    width: '70px',
                    height: '70px',
                    border: '2px solid rgba(0,0,0,0.2)',
                  }}
                >
                  {avatarImage && (
                    <img
                      src={avatarImage}
                      alt="Selected avatar"
                      className="w-100 h-100"
                      style={{ objectFit: 'cover' }}
                    />
                  )}
                </div>
                <div>
                  <h3 className="fw-bold mb-1">{fullName}</h3>
                  <p className="text-muted mb-0">{profile.role || 'USER'}</p>
                </div>
              </div>

              <Form onSubmit={handleSave}>
                <Row className="g-4">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Last name</Form.Label>
                      <Form.Control
                        name="surname"
                        value={formData.surname}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Choose an avatar</Form.Label>
                      <div className="d-flex flex-wrap gap-3 mt-2">
                        {avatarOptions.map((avatar) => {
                          const isSelected = formData.avatar_key === avatar.key;
                          return (
                            <button
                              key={avatar.key}
                              type="button"
                              onClick={() =>
                                setFormData((prev) => ({ ...prev, avatar_key: avatar.key }))
                              }
                              className="p-0 border-0 bg-transparent"
                              aria-label={`Choose avatar ${avatar.label}`}
                            >
                              <div
                                className="rounded-circle overflow-hidden"
                                style={{
                                  width: '74px',
                                  height: '74px',
                                  border: isSelected
                                    ? '3px solid #0d6efd'
                                    : '2px solid rgba(0,0,0,0.15)',
                                  boxShadow: isSelected
                                    ? '0 0 0 0.2rem rgba(13,110,253,0.15)'
                                    : 'none',
                                }}
                              >
                                <img
                                  src={avatar.image}
                                  alt={avatar.label}
                                  className="w-100 h-100"
                                  style={{ objectFit: 'cover' }}
                                />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex flex-wrap gap-2 mt-4">
                  <Button type="submit" variant="primary" disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save changes'}
                  </Button>
                  <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
                    Delete account
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          <Card className="border-0 shadow-sm" style={{ borderRadius: '18px' }}>
            <Card.Body className="p-4 p-md-5">
              <h4 className="fw-bold mb-3">Change password</h4>
              <Form onSubmit={handlePasswordSave}>
                <Row className="g-4">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Current password</Form.Label>
                      <Form.Control
                        type="password"
                        name="current_password"
                        value={passwordForm.current_password}
                        onChange={handlePasswordChange}
                        autoComplete="current-password"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>New password</Form.Label>
                      <Form.Control
                        type="password"
                        name="new_password"
                        value={passwordForm.new_password}
                        onChange={handlePasswordChange}
                        autoComplete="new-password"
                        minLength={8}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Confirm new password</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirm_password"
                        value={passwordForm.confirm_password}
                        onChange={handlePasswordChange}
                        autoComplete="new-password"
                        minLength={8}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Button type="submit" variant="primary" className="mt-4" disabled={isPasswordSaving}>
                  {isPasswordSaving ? 'Updating...' : 'Update password'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </div>
      )}

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Body style={{ padding: '2rem' }}>
          <h4 className="fw-bold mb-3">Delete account</h4>
          <p className="mb-4">
            This action is permanent. Are you sure you want to continue?
          </p>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteAccount} disabled={isSaving}>
              {isSaving ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ProfileUser;
