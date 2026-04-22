// User profile page where the authenticated user can review, edit, or delete the account.
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Nav, Card, Form, Button, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import NavbarCustom from '../components/NavbarCustom';
import { avatarOptions, getAvatarImage } from '../constants/avatarOptions';
import {
  deleteMyAccount,
  getMyProfile,
  updateMyProfile,
} from '../services/portal/PortalService';
import { clearAuthSession } from '../utils/AuthHelpers';

const ProfileUser = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: '',
    surname: '',
    email: '',
    role: 'USER',
    avatar_key: null,
  });
  const [formData, setFormData] = useState({ name: '', surname: '', avatar_key: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (event) => {
    event.preventDefault();

    try {
      setIsSaving(true);
      setError('');
      setStatusMessage('');
      const updated = await updateMyProfile({
        name: formData.name,
        surname: formData.surname,
        avatar_key: formData.avatar_key || null,
      });
      setProfile((prev) => ({
        ...prev,
        name: updated?.name || '',
        surname: updated?.surname || '',
        avatar_key: updated?.avatar_key || '',
      }));
      setStatusMessage('Profile updated successfully.');
    } catch (saveError) {
      setError(saveError.message || 'Error updating profile');
    } finally {
      setIsSaving(false);
    }
  };

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
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8f9fc',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <NavbarCustom />

      <Container fluid className="px-0">
        <Row className="g-0" style={{ minHeight: 'calc(100vh - 70px)' }}>
          <Col
            xs={12}
            md={3}
            lg={2}
            style={{
              backgroundColor: '#dbe8f7',
              borderRight: '1px solid rgba(0,0,0,0.08)',
            }}
          >
            <div className="p-4 text-center border-bottom">
              <div
                className="mx-auto mb-3 rounded-circle bg-white overflow-hidden"
                style={{
                  width: '80px',
                  height: '80px',
                  border: '2px solid rgba(0,0,0,0.15)',
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

              <div className="fw-semibold">{fullName}</div>
              <div className="text-muted small">{profile.role || 'USER'}</div>
            </div>

            <Nav className="flex-column">
              <Nav.Link as={Link} to="/dashboarduser" className="px-4 py-3 fw-semibold text-dark">
                Catalog
              </Nav.Link>
              <Nav.Link as={Link} to="/history" className="px-4 py-3 fw-semibold text-dark">
                History
              </Nav.Link>
              <Nav.Link as={Link} to="/inbox" className="px-4 py-3 fw-semibold text-dark">
                Inbox
              </Nav.Link>
              <Nav.Link as={Link} to="/wallet" className="px-4 py-3 fw-semibold text-dark">
                Wallet
              </Nav.Link>
            </Nav>
          </Col>

          <Col xs={12} md={9} lg={10} className="p-4 p-md-5">
            {error && <div className="alert alert-danger">{error}</div>}
            {statusMessage && <div className="alert alert-success">{statusMessage}</div>}
            {isLoading ? (
              <p className="text-muted">Loading profile...</p>
            ) : (
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
                          <Form.Control value={profile.email} readOnly disabled />
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
            )}
          </Col>
        </Row>
      </Container>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Body style={{ padding: '2rem' }}>
          <h4 className="fw-bold mb-3">Delete account</h4>
          <p className="mb-4">
            This action will permanently remove your profile and all related data. Do you want to continue?
          </p>
          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteAccount} disabled={isSaving}>
              {isSaving ? 'Deleting...' : 'Delete account'}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ProfileUser;
