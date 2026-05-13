// Admin monitoring view to track user transactions and wallet movements.
import React, { useEffect, useMemo, useState } from 'react';
import { Badge, Button, Card, Col, Container, ListGroup, Row } from 'react-bootstrap';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import NavbarCustom from '../components/NavbarCustom';
import MonitoringMovementItem from '../components/MonitoringMovementItem';
import {
  getAdminTransactionHistory,
  getAdminWalletHistory
} from '../services/admin/AdminMonitoringService';

const Monitoring = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = useParams();
  const user = location.state?.user;
  const [transactions, setTransactions] = useState([]);
  const [recharges, setRecharges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadMonitoringData = async () => {
      try {
        setIsLoading(true);
        setError('');

        const resolvedUserId = userId || user?.id;
        if (!resolvedUserId) {
          throw new Error('Missing user id for monitoring');
        }

        const [historyData, walletData] = await Promise.all([
          getAdminTransactionHistory(resolvedUserId),
          getAdminWalletHistory(resolvedUserId)
        ]);

        setTransactions(historyData?.transactions || []);
        setRecharges(walletData?.recharges || []);
      } catch (loadError) {
        setError(loadError.message || 'Error loading monitoring data');
      } finally {
        setIsLoading(false);
      }
    };

    loadMonitoringData();
  }, [userId, user?.id]);

  const movementItems = useMemo(() => {
    const toTimestamp = (value) => {
      const parsed = Date.parse(value);
      return Number.isNaN(parsed) ? 0 : parsed;
    };

    const transactionItems = transactions.map((transaction) => ({
      id: `transaction-${transaction.id}`,
      type: 'Transaction',
      date: transaction.date,
      timestamp: toTimestamp(transaction.date),
      amount: transaction.amount,
      status: transaction.status,
      label: transaction.service,
      detail: transaction.type,
      otherUser: transaction.otherUser || transaction.other_user || '-'
    }));

    const rechargeItems = recharges.map((recharge) => ({
      id: `recharge-${recharge.id}`,
      type: 'Recharge',
      date: recharge.date,
      timestamp: toTimestamp(recharge.date),
      amount: recharge.amount,
      status: 'completed',
      label: 'Wallet recharge',
      detail: 'Wallet',
      otherUser: '-'
    }));

    return [...transactionItems, ...rechargeItems].sort((a, b) => b.timestamp - a.timestamp);
  }, [transactions, recharges]);

  const stats = useMemo(() => {
    const totalTransactions = transactions.length;
    const totalRecharges = recharges.length;
    const totalMovements = totalTransactions + totalRecharges;
    const netAmount = movementItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const totalRechargeAmount = recharges.reduce(
      (sum, item) => sum + (Number(item.amount) || 0),
      0
    );

    return {
      totalMovements,
      totalTransactions,
      totalRecharges,
      netAmount,
      totalRechargeAmount
    };
  }, [movementItems, recharges, transactions.length]);

  const userName = user ? `${user.firstName} ${user.lastName}` : 'User';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fc' }}>
      <NavbarCustom />
      <Container className="py-5">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
          <div>
            <h1 className="fw-bold mb-2">Monitoring</h1>
            <p className="text-muted mb-0">
              Monitor transactions and balances of{' '}
              <Badge bg="secondary" className="fs-5 text-light">{userName}</Badge>.
            </p>
          </div>
          <div className="d-flex align-items-center gap-2">
            <Button variant="outline-secondary" onClick={() => navigate(-1)}>
              Volver
            </Button>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {isLoading && <p className="text-muted">Loading movements...</p>}

        {!isLoading && !error && (
          <>
            <Row className="g-3 mb-4">
              <Col xs={12} md={6} lg={3}>
                <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <Card.Body className="p-3">
                    <p className="text-muted mb-1">Total movements</p>
                    <h4 className="fw-bold mb-0">{stats.totalMovements}</h4>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <Card.Body className="p-3">
                    <p className="text-muted mb-1">Transactions</p>
                    <h4 className="fw-bold mb-0">{stats.totalTransactions}</h4>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <Card.Body className="p-3">
                    <p className="text-muted mb-1">Recharges</p>
                    <h4 className="fw-bold mb-0">{stats.totalRecharges}</h4>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <Card.Body className="p-3">
                    <p className="text-muted mb-1">Net amount</p>
                    <h4 className="fw-bold mb-0">{stats.netAmount} coins</h4>
                    <small className="text-muted">Recharges: {stats.totalRechargeAmount} coins</small>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <div>
            <h1 className="fw-bold mb-2">History </h1>
          </div>
            <Card className="border-0 shadow-sm" style={{ borderRadius: '16px' }}>
              <Card.Body className="p-4">
                {movementItems.length === 0 ? (
                  <p className="text-muted mb-0">No movements to display.</p>
                ) : (
                  <ListGroup variant="flush">
                    {movementItems.map((item) => (
                      <MonitoringMovementItem key={item.id} item={item} />
                    ))}
                  </ListGroup>
                )}
              </Card.Body>
            </Card>
          </>
        )}
      </Container>
    </div>
  );
};

export default Monitoring;
