// Renderiza el bloque de tarjetas informativas de la pagina Home.
import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import './CardsHome.css';

const CardsHome = ({ steps, backgroundColor }) => {
  return (
    <Row className="g-4">
      {steps.map((step, idx) => (
        <Col md={4} key={idx}>
          <Card 
            className="h-100 card-home text-center p-4"
            style={{ backgroundColor: backgroundColor }}>
            <div className="p-3" style={{ height: '180px' }}>
              <img src={step.img} alt={step.title} className="img-fluid h-100" /></div>
            <Card.Body>
              <Card.Title className="fw-bold h3 mb-3 text-yellow">{step.title}</Card.Title>
              <Card.Text style={{ color: 'var(--text-muted)' }}>{step.desc}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default CardsHome;
