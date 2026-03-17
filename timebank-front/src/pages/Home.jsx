import React from 'react';
import { Container, Navbar, Nav, Button, Row, Col, Card } from 'react-bootstrap';
import '../App.css';
import { homeImages } from '../constants/images';
import { Link } from 'react-router-dom'
import logoTimeBank from '../assets/logoTimeBank.PNG';
import CardsHome from '../components/CardsHome';
import ButtonPill from '../components/ButtonPill';

const HomePage = () => {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: '#2d3436' }}>
      {/* --- NAVBAR --- */}
      <Navbar bg="white" expand="lg" className="py-3 shadow-sm sticky-top">
        <Container>
          <Navbar.Brand href="#home" className="fw-bold fs-4 d-flex align-items-center gap-2" 
          style={{ color: 'var(--deep-blue)' }}>
            <img src={logoTimeBank} alt="TimeBank logo" 
            style={{ width: '42px', height: '42px', objectFit: 'contain' }} />
            <span>TimeBank</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              <Nav.Link href="#how" className="me-3">How it works</Nav.Link>
              <ButtonPill as={Link} to="/login"className="px-4 me-2" bg="transparent" border="var(--blue)" font="var(--blue)">Login</ButtonPill>
              <ButtonPill as={Link} to="/register"className="px-4" bg="var(--blue)">Join us</ButtonPill>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* --- HERO SECTION --- */}
      <header className="py-5" style={{ background: 'linear-gradient(135deg, #5a6df9b7 0%, #fff27ae8 100%)' }}>
        <Container className="py-5">
          <Row className="align-items-center">
            <Col lg={6} className="text-center text-lg-start">
              <h1 className="display-3 fw-bold mb-4">
                Your time is the most valuable <span style={{ color: 'var(--yellow)' }}>currency</span>.
              </h1>
              <p className="lead mb-5 text-muted">
                Exchange your skills and time with others in your community. Join TimeBank and start building a network of mutual support today!</p>
              <div className="d-grid d-md-flex justify-content-md-start gap-3">
                <ButtonPill size="lg" className="px-5 py-3 shadow">Start now</ButtonPill>
                <ButtonPill size="lg" className="px-5 py-3 border" bg="white" font="black">Learn more</ButtonPill>
              </div>
            </Col>
            <Col lg={6} className="d-none d-lg-block">
               <div className="rounded-4 shadow-lg p-5 text-white text-center" 
               style={{ backgroundColor: 'var(--blue)' }}>
                  <div className="p-3" style={{ height: '180px' }}>
                    <img src={homeImages.image1} alt="Image1" className="img-fluid h-100" />
                  </div>
                  <p className="fs-4 italic">"Today, I teach guitar. Tomorrow, someone helps me with the garden."</p>
               </div>
            </Col>
          </Row>
        </Container>
      </header>

      {/* --- HOW IT WORKS --- */}
      <section id="how" className="py-5 bg-light">
        <Container className="py-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold display-5">How it works?</h2>
            <p style={{ color: 'var(--text-muted)' }}>3 easy steps</p>
          </div>
          <CardsHome
          steps={[
            { title: 'Offer', img: homeImages.offer, desc: 'Post your skills and services' },
            { title: 'Win', img: homeImages.saveTime, desc: 'Help someone and accumulate hours in your personal account.' },
            { title: 'Receive', img: homeImages.recive, desc: 'Use your hours to request the service you need.' }
          ]} backgroundColor="var(--deep-blue)"/>
        </Container>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-dark text-white py-4 mt-5">
        <Container className="text-center">
          <p className="mb-0">© 2026 TimeBank. Construyendo comunidad minuto a minuto.</p>
        </Container>
      </footer>

    </div>
  );
};

export default HomePage;