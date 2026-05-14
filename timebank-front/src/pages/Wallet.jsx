/*
 * Pagina React que compone estado, servicios y componentes de interfaz.
 *
 * Comentarios generados para documentar la intencion de cada bloque principal.
 */
// Vista de wallet del usuario: muestra saldo, recargas y permite anadir saldo.
import React, { useCallback, useEffect, useState } from 'react';
import { Row, Col, Card, Button, Form, Modal } from 'react-bootstrap';
import {
  createWalletCheckoutSession,
  getWallet,
} from '../services/portal/PortalService';

// Renderiza la pantalla Wallet y coordina sus datos de vista.
const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [status, setStatus] = useState('Active');
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [recharges, setRecharges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const applyWalletData = useCallback((walletData) => {
    setBalance(walletData?.balance || 0);
    setStatus(walletData?.status || 'Active');
    setRecharges(walletData?.recharges || []);
  }, []);

  const waitForWebhookWalletUpdate = useCallback(async (initialWalletData) => {
    const initialBalance = initialWalletData?.balance || 0;
    const initialRechargeCount = initialWalletData?.recharges?.length || 0;

    for (let attempt = 0; attempt < 8; attempt += 1) {
      await new Promise((resolve) => {
        setTimeout(resolve, 1500);
      });

      const updatedWalletData = await getWallet();
      applyWalletData(updatedWalletData);

      const updatedBalance = updatedWalletData?.balance || 0;
      const updatedRechargeCount = updatedWalletData?.recharges?.length || 0;
      if (updatedBalance > initialBalance || updatedRechargeCount > initialRechargeCount) {
        setMessage('Payment confirmed. Your coins were added to the wallet.');
        return;
      }
    }

    setMessage('Payment completed in Stripe. The webhook is still processing; refresh the wallet in a few seconds.');
  }, [applyWalletData]);

  useEffect(() => {
    // Renderiza la pantalla loadWallet y coordina sus datos de vista.
    const loadWallet = async () => {
      try {
        setIsLoading(true);
        setError('');
        setMessage('');

        const searchParams = new URLSearchParams(window.location.search);
        const checkoutSessionId = searchParams.get('stripe_session_id');
        const wasCancelled = searchParams.get('stripe_cancelled') === '1';
        let walletData;

        if (checkoutSessionId) {
          walletData = await getWallet();
          setMessage('Payment completed in Stripe. Waiting for webhook confirmation...');
          applyWalletData(walletData);
          window.history.replaceState({}, document.title, window.location.pathname);
          await waitForWebhookWalletUpdate(walletData);
        } else {
          walletData = await getWallet();
          if (wasCancelled) {
            setMessage('Payment cancelled. No coins were added.');
            window.history.replaceState({}, document.title, window.location.pathname);
          }

          applyWalletData(walletData);
        }
      } catch (loadError) {
        setError(loadError.message || 'Error loading wallet');
      } finally {
        setIsLoading(false);
      }
    };

    loadWallet();
  }, [applyWalletData, waitForWebhookWalletUpdate]);

  // Gestiona el evento de usuario y sincroniza el estado necesario.
  const handleRecharge = async () => {
    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) return;

    try {
      setIsSaving(true);
      setError('');
      setMessage('');
      const checkoutSession = await createWalletCheckoutSession(numericAmount);
      window.location.assign(checkoutSession.checkout_url);
    } catch (saveError) {
      setError(saveError.message || 'Error starting Stripe payment');
      setIsSaving(false);
    }
  };

  return (
    <>
      <h2 className="fw-bold mb-4">Wallet</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-info">{message}</div>}
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
              <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '18px' }}>
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
              {isSaving ? 'Redirecting...' : 'Pay with Stripe'}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Wallet;
