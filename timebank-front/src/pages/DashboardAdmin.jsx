import React from 'react';
import { Container } from 'react-bootstrap';
import NavbarCustom from '../components/NavbarCustom';

const DashboardAdmin = () => {
	return (
		<div style={{ minHeight: '100vh', backgroundColor: '#f8f9fc' }}>
			<NavbarCustom />
			<Container className="py-5">
				<h1 className="fw-bold mb-3">Admin Dashboard</h1>
				<p className="text-muted mb-0">Welcome, admin! You have privileged access.</p>
			</Container>
		</div>
	);
};

export default DashboardAdmin;
