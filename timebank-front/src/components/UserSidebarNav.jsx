/*
 * Componente reutilizable de interfaz para mantener las pantallas mas simples.
 *
 * Comentarios generados para documentar la intencion de cada bloque principal.
 */
import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { to: '/dashboarduser', label: 'Catalog' },
  { to: '/my-services', label: 'My Services' },
  { to: '/my-purchases', label: 'My Purchases' },
  { to: '/my-sales', label: 'My Sales' },
  { to: '/inbox', label: 'Inbox' },
  { to: '/wallet', label: 'Wallet' },
];

const activeStyle = {
  backgroundColor: '#6ea8fe',
  color: 'white',
};

// Renderiza el componente normalizePath con las propiedades recibidas.
const normalizePath = (pathname) =>
  pathname !== '/' && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;

const UserSidebarNav = ({
  inboxCount = 0,
  purchasesCount = 0,
  salesCount = 0,
}) => {
  const { pathname } = useLocation();
  const currentPath = normalizePath(pathname);
  const notificationCounts = {
    '/my-purchases': purchasesCount,
    '/my-sales': salesCount,
    '/inbox': inboxCount,
  };

  return (
    <Nav className="flex-column">
      {navItems.map((item) => {
        const isActive = currentPath === item.to;

        return (
          <Nav.Link
            key={item.to}
            as={Link}
            to={item.to}
            className={`px-4 py-3 fw-semibold d-flex align-items-center justify-content-between${isActive ? '' : ' text-dark'}`}
            style={isActive ? activeStyle : undefined}
          >
            <span>{item.label}</span>
            {notificationCounts[item.to] > 0 && (
              <span className="inbox-count-badge">{notificationCounts[item.to]}</span>
            )}
          </Nav.Link>
        );
      })}
    </Nav>
  );
};

export default UserSidebarNav;
