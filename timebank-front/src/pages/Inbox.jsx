import React, { useState } from 'react';
import { Container, Row, Col, Nav, Modal, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import NavbarCustom from '../components/NavbarCustom';
import Request from '../components/Request';

import bikeImg from '../assets/bike.jpg';
import cleanImg from '../assets/clean.jpg';
import dogImg from '../assets/dog.jpg';
import computerImg from '../assets/computer.avif';

const Inbox = () => {
  const [requests, setRequests] = useState([
    {
      id: 1,
      service: 'Bike Repair',
      description: 'We fix your bike.',
      date: 'Monday 14 at 16:00',
      address: 'Calle Calatrava Nº2',
      message: 'Doorbell is not working',
      image: bikeImg,
      price: '10',
      status: 'pending',
    },
    {
      id: 2,
      service: 'House Cleaning',
      description: 'I clean your house.',
      date: 'Wednesday 16 at 10:00',
      address: 'Calle Toledo Nº5',
      message: 'Bring your own products',
      image: cleanImg,
      price: '12',
      status: 'pending',
    },
    {
      id: 3,
      service: 'Dog Walking',
      description: 'I walk your dog.',
      date: 'Friday 18 at 18:00',
      address: 'Central Park',
      message: 'Small dog, very friendly',
      image: dogImg,
      price: '6',
      status: 'pending',
    },
    {
      id: 4,
      service: 'Computer Repair',
      description: 'Fix your computer.',
      date: 'Saturday 20 at 12:00',
      address: 'Online',
      message: 'Laptop not turning on',
      image: computerImg,
      price: '15',
      status: 'pending',
    },
  ]);

  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const [acceptForm, setAcceptForm] = useState({
    clarification: '',
  });

  const [rejectReason, setRejectReason] = useState('');

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

  const handleAccept = () => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === selectedRequest.id
          ? {
              ...req,
              status: 'accepted',
              clarification: acceptForm.clarification,
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
            <h2 className="fw-bold mb-4">Received requests</h2>

            {pendingRequests.length === 0 ? (
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

            {processedRequests.length > 0 && (
              <>
                <h4 className="fw-bold mt-5 mb-3">Processed requests</h4>

                <Row className="g-3">
                  {processedRequests.map((request) => (
                    <Col xs={12} key={request.id}>
                      <div
                        className="shadow-sm p-4"
                        style={{
                          borderRadius: '20px',
                          backgroundColor:
                            request.status === 'accepted' ? '#e8f5e9' : '#fdeaea',
                        }}
                      >
                        <h5 className="fw-bold mb-2">{request.service}</h5>
                        <p className="mb-1">{request.description}</p>
                        <p className="mb-1 text-muted">
                          <strong>Request:</strong> {request.date}
                        </p>
                        <p className="mb-1 text-muted">
                          <strong>Address:</strong> {request.address}
                        </p>
                        <p className="mb-2 text-muted">
                          <strong>Message:</strong> {request.message}
                        </p>

                        {request.status === 'accepted' && request.clarification && (
                          <p className="mb-1">
                            <strong>Clarification:</strong> {request.clarification}
                          </p>
                        )}

                        {request.status === 'rejected' && request.rejectReason && (
                          <p className="mb-1">
                            <strong>Reject reason:</strong> {request.rejectReason}
                          </p>
                        )}

                        <p className="mb-0 fw-bold">
                          {request.status === 'accepted' ? 'Accepted' : 'Rejected'}
                        </p>
                      </div>
                    </Col>
                  ))}
                </Row>
              </>
            )}
          </Col>
        </Row>
      </Container>

      <Modal show={showAcceptModal} onHide={() => setShowAcceptModal(false)} centered>
        <Modal.Body style={{ backgroundColor: '#dbe8f7', padding: '2rem' }}>
          <h4 className="fw-bold mb-4">{selectedRequest?.service}</h4>

          <p className="mb-1">{selectedRequest?.description}</p>
          <p className="mb-1">
            <strong>Request:</strong> {selectedRequest?.date}
          </p>
          <p className="mb-1">
            <strong>Address:</strong> {selectedRequest?.address}
          </p>
          <p className="mb-3">
            <strong>Message:</strong> {selectedRequest?.message}
          </p>

          <Form.Group className="mb-3">
            <Form.Label>Clarification</Form.Label>
            <Form.Control
              type="text"
              value={acceptForm.clarification}
              onChange={(e) =>
                setAcceptForm({ ...acceptForm, clarification: e.target.value })
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
          <p className="mb-1">
            <strong>Request:</strong> {selectedRequest?.date}
          </p>
          <p className="mb-1">
            <strong>Address:</strong> {selectedRequest?.address}
          </p>
          <p className="mb-3">
            <strong>Message:</strong> {selectedRequest?.message}
          </p>

          <Form.Group className="mb-3">
            <Form.Label>Reject reason</Form.Label>
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