import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Outlet, useLocation } from 'react-router-dom';
import NavbarCustom from './NavbarCustom';
import SidebarUserCard from './SidebarUserCard';
import UserSidebarNav from './UserSidebarNav';
import { getAvatarImage } from '../constants/avatarOptions';
import { getPortalSummary } from '../services/portal/PortalService';

const UserPortalLayout = () => {
  const [profile, setProfile] = useState({ name: '', email: '', avatar_key: null });
  const [error, setError] = useState('');
  const { pathname } = useLocation();

  useEffect(() => {
    let isMounted = true;

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

    return () => {
      isMounted = false;
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
            <SidebarUserCard
              avatarImage={avatarImage}
              name={profile.name}
              email={profile.email}
              linkEnabled={linkEnabled}
            />
            <UserSidebarNav />
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
