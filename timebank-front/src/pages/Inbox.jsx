import React, { useState } from 'react';
import { Container, Row, Col, Nav, Card, Button, Modal, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import NavbarCustom from '../components/NavbarCustom';

const Inbox = () => {
  const [requests, setRequests] = useState([
    {
      id: 1,
      service: 'Bike Repair',
      description: 'We fix your bike.',
      date: 'Availability: Mondays, Wednesdays and Fridays from 16:00',
      address: 'Address: Calle Calatrava Nº2',
      message: 'Additional message: The bell is not working',
      status: 'pending',
    },
  ]);

  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const [acceptForm, setAcceptForm] = useState({
    aclaraciones: '',
  });

  const [rejectReason, setRejectReason] = useState('');

  const openAcceptModal = (request) => {
    setSelectedRequest(request);
    setAcceptForm({ aclaraciones: '' });
    setShowAcceptModal(true);
  };

  const openRejectModal = (request) => {
    setSelectedRequest(request);
    setRejectReason('');
    setShowRejectModal(true);
  };

  const handleAccept = () => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === selectedRequest.id
          ? {
              ...req,
              status: 'accepted',
              aclaraciones: acceptForm.aclaraciones,
            }
          : req
      )
    );
    setShowAcceptModal(false);
    setSelectedRequest(null);
  };

  const handleReject = () => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === selectedRequest.id
          ? {
              ...req,
              status: 'rejected',
              rejectReason: rejectReason,
            }
          : req
      )
    );
    setShowRejectModal(false);
    setSelectedRequest(null);
  };

  const pendingRequests = requests.filter((req) => req.status === 'pending');
  const processedRequests = requests.filter((req) => req.status !== 'pending');

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
                className="mx-auto mb-3 rounded-circle bg-white"
                style={{
                  width: '80px',
                  height: '80px',
                  border: '2px solid rgba(0,0,0,0.15)',
                }}
              ></div>

              <div className="fw-semibold">Antonia</div>
              <div className="text-muted small">User</div>
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
            <h5 className="fw-bold mb-3">You have received:</h5>

            {pendingRequests.length === 0 ? (
              <div
                className="bg-white shadow-sm p-4 mb-4"
                style={{ borderRadius: '16px' }}
              >
                <p className="mb-0 text-muted">You have no pending requests.</p>
              </div>
            ) : (
              pendingRequests.map((request) => (
                <Card
                  key={request.id}
                  className="border-0 shadow-sm mb-4"
                  style={{
                    borderRadius: '0px',
                    overflow: 'hidden',
                    maxWidth: '900px',
                  }}
                >
                  <Row className="g-0">
                    <Col
                      xs={12}
                      md={2}
                      style={{
                        backgroundColor: '#9ea7b1',
                        minHeight: '150px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '0.9rem',
                      }}
                    >
                      Image cap
                    </Col>

                    <Col
                      xs={12}
                      md={8}
                      style={{
                        backgroundColor: '#dbe8f7',
                      }}
                    >
                      <Card.Body>
                        <h5 className="fw-bold mb-2">{request.service}</h5>
                        <p className="mb-1">{request.description}</p>
                        <p className="mb-1 text-muted">Solicitud : {request.date}</p>
                        <p className="mb-1 text-muted">{request.address}</p>
                        <p className="mb-0 text-muted">{request.message}</p>
                      </Card.Body>
                    </Col>

                    <Col
                      xs={12}
                      md={2}
                      className="d-flex align-items-center justify-content-center gap-3"
                      style={{
                        backgroundColor: '#dbe8f7',
                      }}
                    >
                      <Button
                        variant="success"
                        onClick={() => openAcceptModal(request)}
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '8px',
                          padding: 0,
                          fontSize: '1.3rem',
                          lineHeight: 1,
                        }}
                      >
                        ✓
                      </Button>

                      <Button
                        variant="danger"
                        onClick={() => openRejectModal(request)}
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '8px',
                          padding: 0,
                          fontSize: '1.3rem',
                          lineHeight: 1,
                        }}
                      >
                        ✕
                      </Button>
                    </Col>
                  </Row>
                </Card>
              ))
            )}

            {processedRequests.length > 0 && (
              <>
                <h5 className="fw-bold mt-5 mb-3">Solicitudes procesadas</h5>

                {processedRequests.map((request) => (
                  <Card
                    key={request.id}
                    className="border-0 shadow-sm mb-3"
                    style={{ borderRadius: '12px', maxWidth: '900px' }}
                  >
                    <Card.Body
                      style={{
                        backgroundColor:
                          request.status === 'accepted' ? '#e8f5e9' : '#fdeaea',
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
                        <div>
                          <h6 className="fw-bold mb-2">{request.service}</h6>
                          <p className="mb-1">{request.description}</p>
                          <p className="mb-1 text-muted">Solicitud: {request.date}</p>
                          <p className="mb-1 text-muted">{request.address}</p>
                          <p className="mb-2 text-muted">{request.message}</p>

                          {request.status === 'accepted' && request.aclaraciones && (
                            <p className="mb-0">
                              <strong>Additional message:</strong> {request.aclaraciones}
                            </p>
                          )}

                          {request.status === 'rejected' && request.rejectReason && (
                            <p className="mb-0">
                              <strong>Motivo del rechazo:</strong> {request.rejectReason}
                            </p>
                          )}
                        </div>

                        <div className="fw-bold">
                          {request.status === 'accepted' ? 'Aceptada' : 'Rechazada'}
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </>
            )}
          </Col>
        </Row>
      </Container>

      <Modal show={showAcceptModal} onHide={() => setShowAcceptModal(false)} centered>
        <Modal.Body style={{ backgroundColor: '#dbe8f7', padding: '2rem' }}>
          <h4 className="fw-bold mb-4">{selectedRequest?.service}</h4>
          <p className="mb-1">{selectedRequest?.description}</p>
          <p className="mb-1">Solicitud : {selectedRequest?.date}</p>
          <p className="mb-1">{selectedRequest?.address}</p>
          <p className="mb-3">{selectedRequest?.message}</p>

          <Form.Group className="mb-3">
            <Form.Label>Additional message:</Form.Label>
            <Form.Control
              type="text"
              value={acceptForm.aclaraciones}
              onChange={(e) =>
                setAcceptForm({ ...acceptForm, aclaraciones: e.target.value })
              }
            />
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button variant="primary" onClick={handleAccept}>
              Confirm
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)} centered>
        <Modal.Body style={{ backgroundColor: '#f8d7da', padding: '2rem' }}>
          <h4 className="fw-bold mb-4">{selectedRequest?.service}</h4>
          <p className="mb-1">{selectedRequest?.description}</p>
          <p className="mb-1">Solicitud : {selectedRequest?.date}</p>
          <p className="mb-1">{selectedRequest?.address}</p>
          <p className="mb-3">{selectedRequest?.message}</p>

          <Form.Group className="mb-3">
            <Form.Label>Reason for rejection:</Form.Label>
            <Form.Control
              type="text"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button variant="danger" onClick={handleReject}>
              Reject
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Inbox;