import React, { useState } from 'react';
import { Container, Row, Col, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import NavbarCustom from '../components/NavbarCustom';
import TransactionCard from '../components/TransactionCard';

const History = () => {
  const transactions = [
    {
      id: 1,
      type: 'Purchase',
      service: 'Bike Repair',
      otherUser: 'Carlos Gómez',
      date: '2026-04-12',
      amount: '-10 coins',
      status: 'Completed',
    },
    {
      id: 2,
      type: 'Sale',
      service: 'English Lessons',
      otherUser: 'Laura Pérez',
      date: '2026-04-10',
      amount: '+8 coins',
      status: 'Completed',
    },
    {
      id: 3,
      type: 'Purchase',
      service: 'House Cleaning',
      otherUser: 'Marina López',
      date: '2026-04-08',
      amount: '-12 coins',
      status: 'Pending',
    },
    {
      id: 4,
      type: 'Sale',
      service: 'Math Tutoring',
      otherUser: 'David Ruiz',
      date: '2026-04-05',
      amount: '+9 coins',
      status: 'Completed',
    },
    {
      id: 5,
      type: 'Purchase',
      service: 'Dog Walking',
      otherUser: 'Lucía Martín',
      date: '2026-04-03',
      amount: '-6 coins',
      status: 'Cancelled',
    },
    {
      id: 6,
      type: 'Sale',
      service: 'Computer Repair',
      otherUser: 'Sergio Díaz',
      date: '2026-04-01',
      amount: '+15 coins',
      status: 'Completed',
    },
  ];

  const [filter, setFilter] = useState('all');

  const filteredTransactions = transactions.filter((transaction) => {
    if (filter === 'purchases') return transaction.type === 'Purchase';
    if (filter === 'sales') return transaction.type === 'Sale';
    return true;
  });

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
          {/* SIDEBAR */}
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

          {/* MAIN CONTENT */}
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
                    <h5 className="fw-bold mb-2">No hay transacciones</h5>
                    <p className="text-muted mb-0">
                      No se encontraron movimientos para este filtro.
                    </p>
                  </div>
                </Col>
              )}
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default History;