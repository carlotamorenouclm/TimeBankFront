import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { to: '/dashboarduser', label: 'Catalog' },
  { to: '/history', label: 'History' },
  { to: '/inbox', label: 'Inbox' },
  { to: '/wallet', label: 'Wallet' },
];

const activeStyle = {
  backgroundColor: '#6ea8fe',
  color: 'white',
};

const normalizePath = (pathname) =>
  pathname !== '/' && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;

const UserSidebarNav = () => {
  const { pathname } = useLocation();
  const currentPath = normalizePath(pathname);

  return (
    <Nav className="flex-column">
      {navItems.map((item) => {
        const isActive = currentPath === item.to;

        return (
          <Nav.Link
            key={item.to}
            as={Link}
            to={item.to}
            className={`px-4 py-3 fw-semibold${isActive ? '' : ' text-dark'}`}
            style={isActive ? activeStyle : undefined}
          >
            {item.label}
          </Nav.Link>
        );
      })}
    </Nav>
  );
};

export default UserSidebarNav;
