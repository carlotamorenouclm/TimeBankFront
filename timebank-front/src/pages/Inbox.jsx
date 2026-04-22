// Bandeja de entrada del usuario para gestionar solicitudes recibidas.
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Nav, Modal, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import NavbarCustom from '../components/NavbarCustom';
import { getAvatarImage } from '../constants/avatarOptions';
import Request from '../components/Request';
import { getServiceImage } from '../constants/serviceImages';
import {
  acceptInboxRequest,
  getInbox,
  getPortalSummary,
  rejectInboxRequest,
} from '../services/portal/PortalService';

const Inbox = () => {
  const [requests, setRequests] = useState([]);
  const [profile, setProfile] = useState({ name: '', role: 'USER' });
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [acceptForm, setAcceptForm] = useState({ clarification: '' });
  const [rejectReason, setRejectReason] = useState('');

  // Enriquece lo que viene del backend con la imagen local que necesita la UI.
  const normalizeRequests = (items = []) =>
    items.map((item) => ({
      ...item,
      image: getServiceImage(item.image_key),
    }));

  useEffect(() => {
    const loadInbox = async () => {
      try {
        setIsLoading(true);
        setError('');

        const [summaryData, inboxData] = await Promise.all([
          getPortalSummary(),
          getInbox(),
        ]);

        setProfile(summaryData);
        setRequests(normalizeRequests(inboxData?.requests));
      } catch (loadError) {
        setError(loadError.message || 'Error loading inbox');
      } finally {
        setIsLoading(false);
      }
    };

    loadInbox();
  }, []);

  const openAcceptModal = (request) => {
    setSelectedRequest(request);
    setAcceptForm({ clarification: '' });
    setShowAcceptModal(true);
  };

  const openRejectModal = (request) => {
    setSelectedRequest(request);
    setRejectReason('');
    setShowRejectModal(true);
  };

  const handleAccept = async () => {
    if (!selectedRequest) return;

    try {
      setIsSaving(true);
      setError('');
      const inboxData = await acceptInboxRequest(selectedRequest.id, acceptForm.clarification);
      setRequests(normalizeRequests(inboxData?.requests));
      setShowAcceptModal(false);
      setSelectedRequest(null);
    } catch (saveError) {
      setError(saveError.message || 'Error accepting request');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;

    try {
      setIsSaving(true);
      setError('');
      const inboxData = await rejectInboxRequest(selectedRequest.id, rejectReason);
      setRequests(normalizeRequests(inboxData?.requests));
      setShowRejectModal(false);
      setSelectedRequest(null);
    } catch (saveError) {
      setError(saveError.message || 'Error rejecting request');
    } finally {
      setIsSaving(false);
    }
  };

  const pendingRequests = requests.filter((req) => req.status === 'pending');
  const processedRequests = requests.filter((req) => req.status !== 'pending');
  const avatarImage = getAvatarImage(profile.avatar_key);

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
              <Link to="/profile" className="text-decoration-none text-reset d-block">
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
                      alt="User avatar"
                      className="w-100 h-100"
                      style={{ objectFit: 'cover' }}
                    />
                  )}
                </div>

                <div className="fw-semibold">{profile.name || 'User'}</div>
                <div className="text-muted small">{profile.role || 'USER'}</div>
              </Link>
            </div>

            <Nav className="flex-column">
              <Nav.Link
                as={Link}
                to="/dashboarduser"
                className="px-4 py-3 fw-semibold text-dark"
              >
                Catalog
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/history"
                className="px-4 py-3 fw-semibold text-dark"
              >
                History
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/inbox"
                className="px-4 py-3 fw-semibold"
                style={{
                  backgroundColor: '#6ea8fe',
                  color: 'white',
                }}
              >
                Inbox
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/wallet"
                className="px-4 py-3 fw-semibold text-dark"
              >
                Wallet
              </Nav.Link>
            </Nav>
          </Col>

          <Col xs={12} md={9} lg={10} className="p-4 p-md-5">
            <h2 className="fw-bold mb-4">Received requests</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {isLoading && <p className="text-muted">Loading requests...</p>}

            {!isLoading && pendingRequests.length === 0 ? (
              <div
                className="bg-white shadow-sm p-4 mb-4"
                style={{ borderRadius: '16px' }}
              >
                <p className="mb-0 text-muted">You have no pending requests.</p>
              </div>
            ) : (
              <Row className="g-4">
                {pendingRequests.map((request) => (
                  <Col xs={12} key={request.id}>
                    <Request
                      request={request}
                      onAccept={openAcceptModal}
                      onReject={openRejectModal}
                    />
                  </Col>
                ))}
              </Row>
            )}

            {!isLoading && processedRequests.length > 0 && (
              <>
                <h4 className="fw-bold mt-5 mb-3">Processed requests</h4>

                <Row className="g-4">
                  {processedRequests.map((request) => (
                    <Col xs={12} key={request.id}>
                      <Request request={request} />
                    </Col>
                  ))}
                </Row>
              </>
            )}
          </Col>
        </Row>
      </Container>

      <Modal show={showAcceptModal} onHide={() => setShowAcceptModal(false)} centered>
        <Modal.Body style={{ padding: '2rem' }}>
          <h4 className="fw-bold mb-4">Accept request</h4>

          <Form.Group className="mb-4">
            <Form.Label>Clarification for the requester</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Optional message"
              value={acceptForm.clarification}
              onChange={(e) => setAcceptForm({ clarification: e.target.value })}
            />
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={() => setShowAcceptModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAccept} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Confirm'}
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)} centered>
        <Modal.Body style={{ padding: '2rem' }}>
          <h4 className="fw-bold mb-4">Reject request</h4>

          <Form.Group className="mb-4">
            <Form.Label>Reason for rejection</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Explain why you reject this request"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleReject}
              disabled={isSaving || !rejectReason.trim()}
            >
              {isSaving ? 'Saving...' : 'Reject'}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Inbox;
