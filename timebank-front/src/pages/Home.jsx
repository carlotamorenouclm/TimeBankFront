import React from 'react';
import { Container, Navbar, Nav, Button, Row, Col, Card } from 'react-bootstrap';
import '../App.css';
import { homeImages } from '../constants/images';

const HomePage = () => {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: '#2d3436' }}>
      
      {/* --- NAVBAR --- */}
      <Navbar bg="white" expand="lg" className="py-3 shadow-sm sticky-top">
        <Container>
          <Navbar.Brand href="#home" className="fw-bold fs-4 text-primary">
            TimeBank
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              <Nav.Link href="#how" className="me-3">Cómo funciona</Nav.Link>
              <Nav.Link href="#explore" className="me-3">Explorar servicios</Nav.Link>
              <Button variant="outline-primary" className="rounded-pill px-4 me-2">Login</Button>
              <Button variant="primary" className="rounded-pill px-4">Únete gratis</Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* --- HERO SECTION --- */}
      <header className="py-5" style={{ background: 'linear-gradient(135deg, #eff7c2 0%, #cfd5ff 100%)' }}>
        <Container className="py-5">
          <Row className="align-items-center">
            <Col lg={6} className="text-center text-lg-start">
              <h1 className="display-3 fw-bold mb-4">
                Tu tiempo es la <span className="text-primary">moneda</span> más valiosa.
              </h1>
              <p className="lead mb-5 text-muted">
                Intercambia habilidades, ayuda a tu comunidad y descubre nuevos talentos. Sin dinero, solo tiempo por tiempo.
              </p>
              <div className="d-grid d-md-flex justify-content-md-start gap-3">
                <Button variant="primary" size="lg" className="px-5 py-3 rounded-pill shadow">
                  Empezar ahora
                </Button>
                <Button variant="light" size="lg" className="px-5 py-3 rounded-pill border">
                  Saber más
                </Button>
              </div>
            </Col>
            <Col lg={6} className="d-none d-lg-block">
               {/* Aquí iría una ilustración moderna de comunidad */}
               <div className="bg-primary rounded-4 shadow-lg p-5 text-white text-center">
                  <div className="p-3" style={{ height: '180px' }}>
                    <img src={homeImages.image1} alt="Image1" className="img-fluid h-100" />
                  </div>
                  <p className="fs-4 italic">"Hoy enseño guitarra, mañana alguien me ayuda con el jardín."</p>
               </div>
            </Col>
          </Row>
        </Container>
      </header>

      {/* --- FEATURES / HOW IT WORKS --- */}
      <section id="how" className="py-5 bg-light">
        <Container className="py-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold display-5">¿Cómo funciona?</h2>
            <p style={{ color: 'var(--text-muted)' }}>Tres pasos para transformar tu comunidad</p>
          </div>
          <Row className="g-4">
            {[
              { 
                title: 'Ofrece', 
                img: homeImages.offer, 
                desc: 'Publica lo que sabes hacer' 
              },
              { 
                title: 'Gana', 
                img: homeImages.saveTime, 
                desc: 'Ayuda a alguien y acumula horas en tu cuenta personal.' 
              },
              { 
                title: 'Recibe', 
                img: homeImages.recive, 
                desc: 'Usa tus horas para pedir el servicio que tú necesites.' 
              }
            ].map((step, idx) => (
              <Col md={4} key={idx}>
                <Card className="h-100 card-timebank text-center p-4">
                  <div className="p-3" style={{ height: '180px' }}>
                    <img src={step.img} alt={step.title} className="img-fluid h-100" />
                  </div>
                  <Card.Body>
                    <Card.Title className="fw-bold h3 mb-3 text-yellow">{step.title}</Card.Title>
                    <Card.Text style={{ color: 'var(--text-muted)' }}>{step.desc}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
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