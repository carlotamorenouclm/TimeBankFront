import React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import NavbarCustom from '../components/NavbarCustom';
import ServiceCard from '../components/ServiceCard';

import bici from '../assets/bike.jpg';
import clean from '../assets/clean.jpg';
import dog from '../assets/dog.jpg';
import ordenador from '../assets/computer.avif';
import ingles from '../assets/ingles.jpg';
import mates from '../assets/mates.jpg';

const DashboardUser = () => {

  const services = [
    {
      title: "Bike Repair",
      description: "We fix your bike.",
      availability: "Mondays, Wednesdays and Fridays from 16:00",
      extra: "Home service",
      price: "10 coins",
      image: bici
    },
    {
      title: "English Lessons",
      description: "Practice English with a native speaker.",
      availability: "Weekdays from 18:00",
      extra: "Online",
      price: "8 coins",
      image: ingles
    },
    {
      title: "House Cleaning",
      description: "I help you keep your house clean.",
      availability: "Weekends",
      extra: "At your place",
      price: "12 coins",
      image: clean
    },
    {
      title: "Dog Walking",
      description: "I take care of your dog.",
      availability: "Every afternoon",
      extra: "Outdoor service",
      price: "6 coins",
      image: dog
    },
    {
      title: "Math Tutoring",
      description: "Help with school math subjects.",
      availability: "Evenings",
      extra: "Online or in person",
      price: "9 coins",
      image: mates
    },
    {
      title: "Computer Repair",
      description: "Fix software and hardware issues.",
      availability: "Flexible schedule",
      extra: "Home service",
      price: "15 coins",
      image: ordenador
    }
  ];

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

            <Row className="g-4">
              {services.map((service, index) => (
                <Col xs={12} key={index}>
                    <ServiceCard {...service} />
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DashboardUser;