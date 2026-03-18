import React from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logoTimeBank from '../assets/logoTimeBank.PNG';
import ButtonPill from './ButtonPill';

const NavbarCustom = () => {
  return (
    <Navbar bg="white" expand="lg" className="py-1 shadow-sm sticky-top">
      <Container>
        <Navbar.Brand href="/" className="fw-bold fs-4 d-flex align-items-center gap-2" 
        style={{ color: 'var(--deep-blue)' }}>
          <img src={logoTimeBank} alt="TimeBank logo" 
          style={{ width: '42px', height: '42px', objectFit: 'contain' }} />
          <span>TimeBank</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <ButtonPill as={Link} to="/login" className="px-4 me-2" bg="transparent" border="var(--blue)" font="var(--blue)">Login</ButtonPill>
            <ButtonPill as={Link} to="/signup" className="px-4" bg="var(--blue)">Join us</ButtonPill>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarCustom;