// Pantalla de registro de nuevos usuarios de la plataforma.
import React, { useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';
import ButtonPill from '../components/ButtonPill';
import NavbarCustom from '../components/NavbarCustom';
import { registerUser } from '../services/auth/SignUpService';

const Signup = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    registerUser({ firstName, lastName, email, password })
      .then(() => {
        navigate('/login');
      })
      .catch((error) => {
        setError(error.message || 'Error during registration');
        setIsLoading(false);
      });
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: '#2d3436', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* NAVBAR */}
      <NavbarCustom />

      {/* --- SIGNUP --- */}
      <section className="flex-grow-1 d-flex align-items-center" style={{ background: 'linear-gradient(135deg, #5a6df9b7 0%, #fff27ae8 100%)' }}>
        <Container>
          <Row className="justify-content-center">
            <Col xs={12} sm={10} md={6} lg={5}>
              <div className="bg-white rounded-4 shadow-lg p-5">
                <div className="text-center mb-5">
                  <h1 className="fw-bold display-6 mb-2">Create Account</h1>
                  <p className="text-muted">Join TimeBank and start sharing your time</p>
                </div>
                <Form onSubmit={handleRegister}>
                  {/* First Name */}
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-600 mb-2">First Name</Form.Label>
                    <Form.Control
                      type="text" placeholder="Your first name" className="rounded-3 py-2 border-1"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      style={{ borderColor: 'var(--blue)' }}
                      required
                    />
                  </Form.Group>

                  {/* Last Name */}
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-600 mb-2">Last Name</Form.Label>
                    <Form.Control
                      type="text" placeholder="Your last name" className="rounded-3 py-2 border-1"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      style={{ borderColor: 'var(--blue)' }}
                      required
                    />
                  </Form.Group>

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

                  {/* Password */}
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

                  {/* Error Message */}
                  {error && (
                    <div className="alert alert-danger mb-4" role="alert">
                      {error}
                    </div>
                  )}

                  {/* Register Button */}
                  <div className="d-grid mb-4">
                    <ButtonPill 
                      type="submit" 
                      size="lg" 
                      className="py-3 fw-bold" 
                      disabled={isLoading}
                    >
                      {isLoading ? 'Creating Account...' : 'Create Account'}
                    </ButtonPill>
                  </div>

                  {/* Sign In Link */}
                  <p className="text-center text-muted mb-0">
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: 'var(--blue)', textDecoration: 'none', fontWeight: 'bold' }}>Login here</Link>
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

export default Signup;
