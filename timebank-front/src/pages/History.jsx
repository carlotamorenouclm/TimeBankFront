// User history view with filters for purchases, sales, or the full timeline.
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import NavbarCustom from '../components/NavbarCustom';
import { getAvatarImage } from '../constants/avatarOptions';
import TransactionCard from '../components/TransactionCard';
import { getHistory, getPortalSummary } from '../services/portal/PortalService';

const History = () => {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [profile, setProfile] = useState({ name: '', role: 'USER' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setIsLoading(true);
        setError('');

        const [summaryData, historyData] = await Promise.all([
          getPortalSummary(),
          getHistory(),
        ]);

        setProfile(summaryData);
        setTransactions(historyData?.transactions || []);
      } catch (loadError) {
        setError(loadError.message || 'Error loading history');
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, []);

  const filteredTransactions = transactions.filter((transaction) => {
    if (filter === 'purchases') return transaction.type === 'Purchase';
    if (filter === 'sales') return transaction.type === 'Sale';
    return true;
  });
  const avatarImage = getAvatarImage(profile.avatar_key);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8f9fc',
        fontFamily: "'Inter', sans-serif",
        color: '#2d3436',
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
                className="px-4 py-3 fw-semibold"
                style={{
                  backgroundColor: '#6ea8fe',
                  color: 'white',
                }}
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
                className="px-4 py-3 fw-semibold text-dark"
              >
                Wallet
              </Nav.Link>
            </Nav>
          </Col>

          <Col xs={12} md={9} lg={10} className="p-4 p-md-5">
            <div className="mb-4">
              <div className="d-flex gap-3">
                <Button
                  variant={filter === 'purchases' ? 'primary' : 'outline-primary'}
                  onClick={() => setFilter('purchases')}
                >
                  Purchases
                </Button>

                <Button
                  variant={filter === 'sales' ? 'primary' : 'outline-primary'}
                  onClick={() => setFilter('sales')}
                >
                  Sales
                </Button>

                <Button
                  variant={filter === 'all' ? 'primary' : 'outline-primary'}
                  onClick={() => setFilter('all')}
                >
                  All
                </Button>
              </div>
            </div>

            {isLoading && <p className="text-muted">Loading history...</p>}
            {error && <div className="alert alert-danger">{error}</div>}

            {!isLoading && !error && (
              <Row className="g-4">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <Col xs={12} md={6} lg={4} key={transaction.id}>
                      <TransactionCard transaction={transaction} />
                    </Col>
                  ))
                ) : (
                  <Col xs={12}>
                    <div
                      className="bg-white shadow-sm text-center p-5"
                      style={{ borderRadius: '16px' }}
                    >
                      <h5 className="fw-bold mb-2">No transactions found</h5>
                      <p className="text-muted mb-0">
                        No transactions match the selected filter.
                      </p>
                    </div>
                  </Col>
                )}
              </Row>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default History;
