import React, { useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';
import ButtonPill from '../components/ButtonPill';
import NavbarCustom from '../components/NavbarCustom';
import { checkIfAdmin, loginUser } from '../services/admin/UsersService';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const data = await loginUser({ email, password });

      if (!data?.access_token) {
        throw new Error('Login failed: No access token received');
      }

      localStorage.setItem('access_token', data.access_token);

      const adminUser = await checkIfAdmin(data.access_token);

      navigate(adminUser ? '/dashboardadmin' : '/dashboarduser');
    } catch (error) {
      setError(error.message || 'Error during login');
    } finally {
      setIsLoading(false);
    }
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

                {/* Error Message */}
                  {error && (
                    <div className="alert alert-danger mb-4" role="alert">
                      {error}
                    </div>
                  )}

                  {/* Login Button */}
                  <div className="d-grid mb-4">
                    <ButtonPill type="submit" size="lg" className="py-3 fw-bold" disabled={isLoading}>
                      {isLoading ? 'Signing in...' : 'Sign in'}
                    </ButtonPill>
                  </div>

                  {/* Sign Up Link */}
                  <p className="text-center text-muted mb-0">Don't have an account?{' '}
                    <Link to="/signup" style={{ color: 'var(--blue)', textDecoration: 'none', fontWeight: 'bold' }}>Sign up here</Link>
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