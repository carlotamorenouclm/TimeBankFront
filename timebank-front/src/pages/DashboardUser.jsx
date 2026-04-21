import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import NavbarCustom from '../components/NavbarCustom';
import ServiceCard from '../components/ServiceCard';
import { getServiceImage } from '../constants/serviceImages';
import { getDashboardServices, getPortalSummary } from '../services/portal/PortalService';

const DashboardUser = () => {
  const [services, setServices] = useState([]);
  const [profile, setProfile] = useState({ name: '', role: 'USER' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setIsLoading(true);
        setError('');

        const [summaryData, dashboardData] = await Promise.all([
          getPortalSummary(),
          getDashboardServices(),
        ]);

        setProfile(summaryData);
        setServices(dashboardData?.services || []);
      } catch (loadError) {
        setError(loadError.message || 'Error loading services');
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

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
              <div
                className="mx-auto mb-3 rounded-circle bg-white"
                style={{
                  width: '80px',
                  height: '80px',
                  border: '2px solid rgba(0,0,0,0.15)',
                }}
              ></div>

              <div className="fw-semibold">{profile.name || 'User'}</div>
              <div className="text-muted small">{profile.role || 'USER'}</div>
            </div>

            <Nav className="flex-column">
              <Nav.Link
                as={Link}
                to="/dashboarduser"
                className="px-4 py-3 fw-semibold"
                style={{
                  backgroundColor: '#6ea8fe',
                  color: 'white',
                }}
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
                className="px-4 py-3 fw-semibold text-dark"
              >
                Wallet
              </Nav.Link>
            </Nav>
          </Col>

          <Col xs={12} md={9} lg={10} className="p-4 p-md-5">
            <h2 className="fw-bold mb-4">Available Services</h2>
            {isLoading && <p className="text-muted">Loading services...</p>}
            {error && <div className="alert alert-danger">{error}</div>}

            {!isLoading && !error && (
              <Row className="g-4">
                {services.map((service) => (
                  <Col xs={12} key={service.id}>
                    <ServiceCard
                      title={service.title}
                      description={service.description}
                      availability={service.availability}
                      extra={`${service.extra} · Provider: ${service.owner_name}`}
                      price={`${service.price} coins`}
                      image={getServiceImage(service.image_key)}
                    />
                  </Col>
                ))}
              </Row>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DashboardUser;
