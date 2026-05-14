/*
 * Componente reutilizable de interfaz para mantener las pantallas mas simples.
 *
 * Comentarios generados para documentar la intencion de cada bloque principal.
 */
import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Outlet, useLocation } from 'react-router-dom';
import NavbarCustom from './NavbarCustom';
import SidebarUserCard from './SidebarUserCard';
import UserSidebarNav from './UserSidebarNav';
import { getAvatarImage } from '../constants/avatarOptions';
import { getPortalSummary } from '../services/portal/PortalService';

// Renderiza el componente UserPortalLayout con las propiedades recibidas.
const UserPortalLayout = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    avatar_key: null,
    pending_inbox_count: 0,
    pending_purchases_count: 0,
    pending_sales_count: 0,
  });
  const [error, setError] = useState('');
  const { pathname } = useLocation();

  useEffect(() => {
    let isMounted = true;

    // Renderiza el componente loadSummary con las propiedades recibidas.
    const loadSummary = async () => {
      try {
        setError('');
        const summaryData = await getPortalSummary();
        if (!isMounted) return;
        setProfile(summaryData || {});
      } catch (loadError) {
        if (!isMounted) return;
        setError(loadError.message || 'Error loading profile');
      }
    };

    loadSummary();
    const intervalId = window.setInterval(loadSummary, 5000);
    window.addEventListener('portal-summary-refresh', loadSummary);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
      window.removeEventListener('portal-summary-refresh', loadSummary);
    };
  }, []);

  const avatarImage = getAvatarImage(profile.avatar_key);
  const linkEnabled = pathname !== '/profile';

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
            <div className="user-sidebar-sticky">
              <SidebarUserCard
                avatarImage={avatarImage}
                name={profile.name}
                email={profile.email}
                linkEnabled={linkEnabled}
              />
              <UserSidebarNav
                inboxCount={profile.pending_inbox_count || 0}
                purchasesCount={profile.pending_purchases_count || 0}
                salesCount={profile.pending_sales_count || 0}
              />
            </div>
          </Col>

          <Col xs={12} md={9} lg={10} className="p-4 p-md-5">
            {error && <div className="alert alert-danger">{error}</div>}
            <Outlet />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default UserPortalLayout;
