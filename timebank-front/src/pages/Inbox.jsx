/*
 * Pagina React que compone estado, servicios y componentes de interfaz.
 *
 * Comentarios generados para documentar la intencion de cada bloque principal.
 */
// Bandeja de entrada del usuario para gestionar solicitudes recibidas.
import React, { useEffect, useState } from 'react';
import { Row, Col, Modal, Form, Button } from 'react-bootstrap';
import Request from '../components/Request';
import {
  acceptInboxRequest,
  getInbox,
  rejectInboxRequest,
} from '../services/portal/PortalService';

// Renderiza la pantalla Inbox y coordina sus datos de vista.
const Inbox = () => {
  const [requests, setRequests] = useState([]);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [acceptForm, setAcceptForm] = useState({ clarification: '' });
  const [rejectReason, setRejectReason] = useState('');

  // Renderiza la pantalla normalizeRequests y coordina sus datos de vista.
  const normalizeRequests = (items = []) =>
    items.map((item) => ({
      ...item,
      image: item.image_key,
    }));

  useEffect(() => {
    // Renderiza la pantalla loadInbox y coordina sus datos de vista.
    const loadInbox = async () => {
      try {
        setIsLoading(true);
        setError('');

        const inboxData = await getInbox();
        setRequests(normalizeRequests(inboxData?.requests));
      } catch (loadError) {
        setError(loadError.message || 'Error loading inbox');
      } finally {
        setIsLoading(false);
      }
    };

    loadInbox();
  }, []);

  // Renderiza la pantalla openAcceptModal y coordina sus datos de vista.
  const openAcceptModal = (request) => {
    setSelectedRequest(request);
    setAcceptForm({ clarification: '' });
    setShowAcceptModal(true);
  };

  // Renderiza la pantalla openRejectModal y coordina sus datos de vista.
  const openRejectModal = (request) => {
    setSelectedRequest(request);
    setRejectReason('');
    setShowRejectModal(true);
  };

  // Gestiona el evento de usuario y sincroniza el estado necesario.
  const handleAccept = async () => {
    if (!selectedRequest) return;

    try {
      setIsSaving(true);
      setError('');
      const inboxData = await acceptInboxRequest(selectedRequest.id, acceptForm.clarification);
      setRequests(normalizeRequests(inboxData?.requests));
      window.dispatchEvent(new Event('portal-summary-refresh'));
      setShowAcceptModal(false);
      setSelectedRequest(null);
    } catch (saveError) {
      setError(saveError.message || 'Error accepting request');
    } finally {
      setIsSaving(false);
    }
  };

  // Gestiona el evento de usuario y sincroniza el estado necesario.
  const handleReject = async () => {
    if (!selectedRequest) return;

    try {
      setIsSaving(true);
      setError('');
      const inboxData = await rejectInboxRequest(selectedRequest.id, rejectReason);
      setRequests(normalizeRequests(inboxData?.requests));
      window.dispatchEvent(new Event('portal-summary-refresh'));
      setShowRejectModal(false);
      setSelectedRequest(null);
    } catch (saveError) {
      setError(saveError.message || 'Error rejecting request');
    } finally {
      setIsSaving(false);
    }
  };

  const pendingRequests = requests.filter((req) => req.status === 'pending');
  return (
    <>
      <h2 className="fw-bold mb-4">Received requests</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {isLoading && <p className="text-muted">Loading requests...</p>}

      {!isLoading && pendingRequests.length === 0 ? (
        <div className="bg-white shadow-sm p-4 mb-4" style={{ borderRadius: '16px' }}>
          <p className="mb-0 text-muted">You have no pending requests.</p>
        </div>
      ) : (
        <Row className="g-4">
          {pendingRequests.map((request) => (
            <Col xs={12} key={request.id}>
              <Request request={request} onAccept={openAcceptModal} onReject={openRejectModal} />
            </Col>
          ))}
        </Row>
      )}


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
    </>
  );
};

export default Inbox;
