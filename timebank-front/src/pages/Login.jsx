import React, { useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../App.css';
import ButtonPill from '../components/ButtonPill';
import NavbarCustom from '../components/NavbarCustom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Login:', { email, password });
    // Aquí irá la lógica de autenticación
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: '#2d3436', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* NAVBAR */}
      <NavbarCustom />

      {/* --- LOGIN --- */}
      <section className="flex-grow-1 d-flex align-items-center" style={{ background: 'linear-gradient(135deg, #5a6df9b7 0%, #fff27ae8 100%)' }}>
        <Container>
          <Row className="justify-content-center">
            <Col xs={12} sm={10} md={6} lg={5}>
              <div className="bg-white rounded-4 shadow-lg p-5">
                <div className="text-center mb-5">
                  <h1 className="fw-bold display-6 mb-2">Welcome back</h1>
                  <p className="text-muted">Sign in to your TimeBank account</p>
                </div>
                <Form onSubmit={handleLogin}>
                  {/* Email */}
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-600 mb-2">Email</Form.Label>
                    <Form.Control
                      type="email" placeholder="your@email.com" className="rounded-3 py-2 border-1"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ borderColor: 'var(--blue)' }}
                      required
                    />
                  </Form.Group>

                  {/* Contraseña */}
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-600 mb-2">Password</Form.Label>
                    <Form.Control
                      type="password" placeholder="••••••••" className="rounded-3 py-2 border-1"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{ borderColor: 'var(--blue)' }}
                      required
                    />
                  </Form.Group>

                  {/* Forgot Password */}
                  <div className="text-end mb-4">
                    <Link to="/forgot-password" style={{ color: 'var(--blue)', textDecoration: 'none', fontSize: '0.9rem' }}>Forgot password?</Link></div>

                  {/* Login Button */}
                  <div className="d-grid mb-4">
                    <ButtonPill type="submit" size="lg" className="py-3 fw-bold">Sign in</ButtonPill></div>

                  {/* Sign Up Link */}
                  <p className="text-center text-muted mb-0">Don't have an account?{' '}
                    <Link to="/register" style={{ color: 'var(--blue)', textDecoration: 'none', fontWeight: 'bold' }}>Sign up here</Link>
                  </p>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Login;