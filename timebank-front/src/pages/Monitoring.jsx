/*
 * Pagina React que compone estado, servicios y componentes de interfaz.
 *
 * Comentarios generados para documentar la intencion de cada bloque principal.
 */
// Admin monitoring view to track user transactions and wallet movements.
import React, { useEffect, useMemo, useState } from 'react';
import { Badge, Button, Card, Col, Container, ListGroup, Row } from 'react-bootstrap';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import NavbarCustom from '../components/NavbarCustom';
import MonitoringMovementItem from '../components/MonitoringMovementItem';
import RatingStars from '../components/RatingStars';
import {
  deleteAdminService,
  deleteAdminReview,
  getAdminUserServices,
  getAdminUserReviews,
  getAdminTransactionHistory,
  getAdminWalletHistory,
  updateAdminServiceVisibility
} from '../services/admin/AdminMonitoringService';

// Renderiza la pantalla Monitoring y coordina sus datos de vista.
const Monitoring = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = useParams();
  const user = location.state?.user;
  const sourceView = location.state?.role === 'Admin' ? 'admins' : 'users';
  const [transactions, setTransactions] = useState([]);
  const [recharges, setRecharges] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingReviewId, setDeletingReviewId] = useState(null);
  const [activeServiceActionId, setActiveServiceActionId] = useState(null);

  useEffect(() => {
    // Renderiza la pantalla loadMonitoringData y coordina sus datos de vista.
    const loadMonitoringData = async () => {
      try {
        setIsLoading(true);
        setError('');

        const resolvedUserId = userId || user?.id;
        if (!resolvedUserId) {
          throw new Error('Missing user id for monitoring');
        }

        const [historyData, walletData, reviewsData, servicesData] = await Promise.all([
          getAdminTransactionHistory(resolvedUserId),
          getAdminWalletHistory(resolvedUserId),
          getAdminUserReviews(resolvedUserId),
          getAdminUserServices(resolvedUserId)
        ]);

        setTransactions(historyData?.transactions || []);
        setRecharges(walletData?.recharges || []);
        setReviews(Array.isArray(reviewsData) ? reviewsData : []);
        setServices(Array.isArray(servicesData) ? servicesData : []);
      } catch (loadError) {
        setError(loadError.message || 'Error loading monitoring data');
      } finally {
        setIsLoading(false);
      }
    };

    loadMonitoringData();
  }, [userId, user?.id]);

  const movementItems = useMemo(() => {
    // Renderiza la pantalla toTimestamp y coordina sus datos de vista.
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

  // Gestiona el evento de usuario y sincroniza el estado necesario.
  const handleDeleteReview = async (review) => {
    const shouldDelete = window.confirm('Delete this review?');
    if (!shouldDelete) return;

    try {
      setDeletingReviewId(review.id);
      setError('');
      await deleteAdminReview(review.id);
      setReviews((prev) => prev.filter((item) => item.id !== review.id));
    } catch (deleteError) {
      setError(deleteError.message || 'Error deleting review');
    } finally {
      setDeletingReviewId(null);
    }
  };

  // Gestiona el evento de usuario y sincroniza el estado necesario.
  const handleToggleServiceVisibility = async (service) => {
    try {
      setActiveServiceActionId(service.id);
      setError('');
      const updatedService = await updateAdminServiceVisibility(service.id, !service.is_visible);
      setServices((prev) =>
        prev.map((item) => (item.id === updatedService.id ? updatedService : item))
      );
    } catch (actionError) {
      setError(actionError.message || 'Error updating service visibility');
    } finally {
      setActiveServiceActionId(null);
    }
  };

  // Gestiona el evento de usuario y sincroniza el estado necesario.
  const handleDeleteService = async (service) => {
    const shouldDelete = window.confirm(`Delete service "${service.title}"?`);
    if (!shouldDelete) return;

    try {
      setActiveServiceActionId(service.id);
      setError('');
      await deleteAdminService(service.id);
      setServices((prev) => prev.filter((item) => item.id !== service.id));
    } catch (actionError) {
      setError(actionError.message || 'Error deleting service');
    } finally {
      setActiveServiceActionId(null);
    }
  };

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
            <Button variant="outline-secondary" onClick={() => navigate(`/dashboardadmin?view=${sourceView}`)}>
              Go back
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

            <div className="mt-5">
              <h1 className="fw-bold mb-2">Service moderation</h1>
            </div>
            <Card className="border-0 shadow-sm" style={{ borderRadius: '16px' }}>
              <Card.Body className="p-4">
                {services.length === 0 ? (
                  <p className="text-muted mb-0">No services published by this user.</p>
                ) : (
                  <ListGroup variant="flush">
                    {services.map((service) => {
                      const isServiceActionActive = activeServiceActionId === service.id;

                      return (
                        <ListGroup.Item
                          key={service.id}
                          className="py-3 d-flex flex-column flex-lg-row justify-content-between align-items-start gap-3"
                        >
                          <div className="d-flex gap-3">
                            {service.image_key && (
                              <img
                                src={service.image_key}
                                alt={service.title}
                                style={{
                                  width: '96px',
                                  height: '72px',
                                  objectFit: 'cover',
                                  borderRadius: '10px',
                                }}
                              />
                            )}
                            <div>
                              <div className="d-flex align-items-center gap-2 flex-wrap">
                                <span className="fw-bold">{service.title}</span>
                                <Badge bg={service.is_visible ? 'success' : 'secondary'}>
                                  {service.is_visible ? 'Visible' : 'Hidden'}
                                </Badge>
                              </div>
                              <p className="mb-1 text-muted">{service.description}</p>
                              <div className="text-muted small">
                                {service.price} coins · {service.home_service ? 'Home service' : service.address || 'Address pending'}
                              </div>
                            </div>
                          </div>

                          <div className="d-flex gap-2 flex-wrap">
                            <Button
                              variant={service.is_visible ? 'outline-secondary' : 'outline-success'}
                              size="sm"
                              disabled={isServiceActionActive}
                              onClick={() => handleToggleServiceVisibility(service)}
                            >
                              {service.is_visible ? 'Hide' : 'Show'}
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              disabled={isServiceActionActive}
                              onClick={() => handleDeleteService(service)}
                            >
                              {isServiceActionActive ? 'Working...' : 'Delete'}
                            </Button>
                          </div>
                        </ListGroup.Item>
                      );
                    })}
                  </ListGroup>
                )}
              </Card.Body>
            </Card>

            <div className="mt-5">
              <h1 className="fw-bold mb-2">Reviews</h1>
            </div>
            <Card className="border-0 shadow-sm" style={{ borderRadius: '16px' }}>
              <Card.Body className="p-4">
                {reviews.length === 0 ? (
                  <p className="text-muted mb-0">No reviews written by this user.</p>
                ) : (
                  <ListGroup variant="flush">
                    {reviews.map((review) => (
                      <ListGroup.Item
                        key={review.id}
                        className="py-3 d-flex flex-column flex-md-row justify-content-between align-items-start gap-3"
                      >
                        <div>
                          <div className="d-flex align-items-center gap-2 flex-wrap">
                            <span className="fw-bold">{review.service || 'Review'}</span>
                            <Badge bg="secondary">Review</Badge>
                          </div>
                          <div className="my-2">
                            <RatingStars value={review.rating} onChange={null} size="1.3rem" />
                          </div>
                          <p className="mb-1">{review.comment || 'No comment provided.'}</p>
                          <div className="text-muted small">
                            {review.created_at} · Reviewed user: {review.reviewed_user_name || review.reviewed_user_id}
                          </div>
                        </div>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          disabled={deletingReviewId === review.id}
                          onClick={() => handleDeleteReview(review)}
                        >
                          {deletingReviewId === review.id ? 'Deleting...' : 'Delete'}
                        </Button>
                      </ListGroup.Item>
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
