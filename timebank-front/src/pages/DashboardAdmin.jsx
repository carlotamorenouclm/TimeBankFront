// Panel de administracion para alternar entre lista de admins y lista de usuarios.
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import NavbarCustom from '../components/NavbarCustom';
import UserListCard from '../components/UserListCard';
import { getAllAdmins, getAllUsers } from '../services/admin/UsersService';

const DashboardAdmin = () => {
	const [activeView, setActiveView] = useState('admins');
	const [admins, setAdmins] = useState([]);
	const [users, setUsers] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState('');
	const loadDashboardData = async () => {
			setIsLoading(true);
			setErrorMessage('');

			try {
				const token = localStorage.getItem('access_token');
				const [adminsData, usersData] = await Promise.all([
					getAllAdmins(token),
					getAllUsers(token)
				]);

				setAdmins(adminsData);
				setUsers(usersData);
			} catch (error) {
				setErrorMessage(error.message || 'No se pudo cargar la informacion del dashboard.');
			} finally {
				setIsLoading(false);
			}
		};

	useEffect(() => {
		loadDashboardData();
	}, []);

	const currentUsers = useMemo(() => {
		return activeView === 'admins' ? admins : users;
	}, [activeView, admins, users]);

	const roleLabel = activeView === 'admins' ? 'Admin' : 'User';
	const badgeVariant = activeView === 'admins' ? 'warning' : 'primary';

	return (
		<div style={{ minHeight: '100vh', backgroundColor: '#f8f9fc' }}>
			<NavbarCustom />
			<Container className="py-5">
				<div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
					<div>
						<h1 className="fw-bold mb-2">Administration panel</h1>
						<p className="text-muted mb-0">Manage and review system accounts.</p>
					</div>
					<div className="d-flex gap-2">
						<Button
							variant={activeView === 'admins' ? 'primary' : 'outline-primary'}
							onClick={() => setActiveView('admins')}
						>
							Ver administradores
						</Button>
						<Button
							variant={activeView === 'users' ? 'primary' : 'outline-primary'}
							onClick={() => setActiveView('users')}
						>
							Ver usuarios
						</Button>
					</div>
				</div>

				{isLoading ? (
					<p className="text-muted mb-0">Cargando usuarios...</p>
				) : errorMessage ? (
					<p className="text-danger mb-0">{errorMessage}</p>
				) : currentUsers.length === 0 ? (
					<p className="text-muted mb-0">No hay registros para mostrar.</p>
				) : (
					<Row className="g-3">
						{currentUsers.map((user) => (
							<Col md={6} lg={4} key={user.id}>
								<UserListCard user={user} roleLabel={roleLabel} badgeVariant={badgeVariant} />
							</Col>
						))}
					</Row>
				)}
			</Container>
		</div>
	);
};

export default DashboardAdmin;
