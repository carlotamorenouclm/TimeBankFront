// Vista de wallet del usuario: muestra saldo, recargas y permite anadir saldo.
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Nav, Card, Button, Form, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import NavbarCustom from '../components/NavbarCustom';
import { getAvatarImage } from '../constants/avatarOptions';
import { getPortalSummary, getWallet, rechargeWallet } from '../services/portal/PortalService';

const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [status, setStatus] = useState('Active');
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [recharges, setRecharges] = useState([]);
  const [profile, setProfile] = useState({ name: '', role: 'USER' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const avatarImage = getAvatarImage(profile.avatar_key);

  useEffect(() => {
    const loadWallet = async () => {
      try {
        setIsLoading(true);
        setError('');

        const [summaryData, walletData] = await Promise.all([
          getPortalSummary(),
          getWallet(),
        ]);

        setProfile(summaryData);
        setBalance(walletData?.balance || 0);
        setStatus(walletData?.status || 'Active');
        setRecharges(walletData?.recharges || []);
      } catch (loadError) {
        setError(loadError.message || 'Error loading wallet');
      } finally {
        setIsLoading(false);
      }
    };

    loadWallet();
  }, []);

  const handleRecharge = async () => {
    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) return;

    try {
      setIsSaving(true);
      setError('');
      const walletData = await rechargeWallet(numericAmount);
      setBalance(walletData?.balance || 0);
      setStatus(walletData?.status || 'Active');
      setRecharges(walletData?.recharges || []);
      setAmount('');
      setShowModal(false);
    } catch (saveError) {
      setError(saveError.message || 'Error recharging wallet');
    } finally {
      setIsSaving(false);
    }
  };

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
                className="px-4 py-3 fw-semibold text-dark"
              >
                Inbox
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/wallet"
                className="px-4 py-3 fw-semibold"
                style={{
                  backgroundColor: '#6ea8fe',
                  color: 'white',
                }}
              >
                Wallet
              </Nav.Link>
            </Nav>
          </Col>

          <Col xs={12} md={9} lg={10} className="p-4 p-md-5">
            <h2 className="fw-bold mb-4">Wallet</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {isLoading && <p className="text-muted">Loading wallet...</p>}

            {!isLoading && (
              <>
                <Row className="g-4 mb-4">
                  <Col xs={12} lg={8}>
                    <Card
                      className="border-0 shadow-sm"
                      style={{
                        borderRadius: '18px',
                        background: 'linear-gradient(135deg, #0d6efd, #6ea8fe)',
                        color: 'white',
                      }}
                    >
                      <Card.Body className="p-4">
                        <p className="mb-2" style={{ opacity: 0.9 }}>
                          Current balance
                        </p>
                        <h1 className="fw-bold mb-3">{balance} coins</h1>
                        <p className="mb-4" style={{ opacity: 0.9 }}>
                          Use your time credits to request services from other users.
                        </p>
                        <Button variant="light" onClick={() => setShowModal(true)}>
                          Recharge balance
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col xs={12} lg={4}>
                    <Card
                      className="border-0 shadow-sm h-100"
                      style={{ borderRadius: '18px' }}
                    >
                      <Card.Body className="p-4">
                        <h5 className="fw-bold mb-3">Quick amounts</h5>

                        <div className="d-grid gap-2">
                          <Button
                            variant="outline-primary"
                            onClick={() => {
                              setAmount('5');
                              setShowModal(true);
                            }}
                          >
                            +5 coins
                          </Button>
                          <Button
                            variant="outline-primary"
                            onClick={() => {
                              setAmount('10');
                              setShowModal(true);
                            }}
                          >
                            +10 coins
                          </Button>
                          <Button
                            variant="outline-primary"
                            onClick={() => {
                              setAmount('20');
                              setShowModal(true);
                            }}
                          >
                            +20 coins
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                <Row className="g-4">
                  <Col xs={12} lg={6}>
                    <Card className="border-0 shadow-sm" style={{ borderRadius: '18px' }}>
                      <Card.Body className="p-4">
                        <h5 className="fw-bold mb-3">Wallet summary</h5>
                        <p className="mb-2"><strong>Available credits:</strong> {balance}</p>
                        <p className="mb-2"><strong>Total recharges:</strong> {recharges.length}</p>
                        <p className="mb-0"><strong>Status:</strong> {status}</p>
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col xs={12} lg={6}>
                    <Card className="border-0 shadow-sm" style={{ borderRadius: '18px' }}>
                      <Card.Body className="p-4">
                        <h5 className="fw-bold mb-3">Last recharges</h5>

                        {recharges.length === 0 ? (
                          <p className="text-muted mb-0">No recharges yet.</p>
                        ) : (
                          recharges.map((item) => (
                            <div
                              key={item.id}
                              className="d-flex justify-content-between align-items-center py-2 border-bottom"
                            >
                              <span>{item.date}</span>
                              <span className="fw-bold text-success">+{item.amount} coins</span>
                            </div>
                          ))
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </>
            )}
          </Col>
        </Row>
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Body style={{ padding: '2rem' }}>
          <h4 className="fw-bold mb-4">Recharge wallet</h4>

          <Form.Group className="mb-3">
            <Form.Label>Amount of coins</Form.Label>
            <Form.Control
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleRecharge} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Confirm'}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Wallet;
