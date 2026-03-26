import React from 'react';
import { Container } from 'react-bootstrap';
import NavbarCustom from '../components/NavbarCustom';

const DashboardUser = () => {
	return (
		<div style={{ minHeight: '100vh', backgroundColor: '#f8f9fc' }}>
			<NavbarCustom />
			<Container className="py-5">
				<h1 className="fw-bold mb-3">User Dashboard</h1>
				<p className="text-muted mb-0">Login successful. Welcome to your dashboard.</p>
			</Container>
		</div>
	);
};

export default DashboardUser;
