// Panel de administracion para alternar entre lista de admins y lista de usuarios.
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import NavbarCustom from '../components/NavbarCustom';
import UserListCard from '../components/UserListCard';
import { deleteUser, getAllAdmins, getAllUsers, updateUserIsActive } from '../services/admin/UsersService';

const DashboardAdmin = () => {
	const [activeView, setActiveView] = useState('admins');
	const [admins, setAdmins] = useState([]);
	const [users, setUsers] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState('');
	const [activeToggleId, setActiveToggleId] = useState(null);
	const [activeDeleteId, setActiveDeleteId] = useState(null);
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
				setErrorMessage(error.message || 'The dashboard information could not be loaded.');
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

	const handleToggleActive = async (userId, nextIsActive) => {
		setActiveToggleId(userId);
		setErrorMessage('');
		try {
			const token = localStorage.getItem('access_token');
			await updateUserIsActive({ userId, isActive: nextIsActive, accessToken: token });

			setAdmins((prev) =>
				prev.map((admin) =>
					admin.id === userId ? { ...admin, isActive: nextIsActive } : admin
				)
			);
			setUsers((prev) =>
				prev.map((currentUser) =>
					currentUser.id === userId ? { ...currentUser, isActive: nextIsActive } : currentUser
				)
			);
		} catch (error) {
			setErrorMessage(error.message || 'The user status could not be updated.');
		} finally {
			setActiveToggleId(null);
		}
	};

	const handleDeleteUser = async (userToDelete) => {
		if (!userToDelete) return;
		const fullName = `${userToDelete.firstName} ${userToDelete.lastName}`;
		const shouldDelete = window.confirm(`Delete ${fullName}?`);
		if (!shouldDelete) return;

		setActiveDeleteId(userToDelete.id);
		setErrorMessage('');
		try {
			const token = localStorage.getItem('access_token');
			await deleteUser({ userId: userToDelete.id, accessToken: token });

			setAdmins((prev) => prev.filter((admin) => admin.id !== userToDelete.id));
			setUsers((prev) => prev.filter((currentUser) => currentUser.id !== userToDelete.id));
		} catch (error) {
			setErrorMessage(error.message || 'The user could not be deleted.');
		} finally {
			setActiveDeleteId(null);
		}
	};

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
							Admin
						</Button>
						<Button
							variant={activeView === 'users' ? 'primary' : 'outline-primary'}
							onClick={() => setActiveView('users')}
						>
							Users
						</Button>
					</div>
				</div>

				{isLoading ? (
					<p className="text-muted mb-0">Loading users...</p>
				) : errorMessage ? (
					<p className="text-danger mb-0">{errorMessage}</p>
				) : currentUsers.length === 0 ? (
					<p className="text-muted mb-0">There are no records to display.</p>
				) : (
					<Row className="g-3">
						{currentUsers.map((user) => (
							<Col md={6} lg={4} key={user.id}>
								<UserListCard
									user={user}
									roleLabel={roleLabel}
									badgeVariant={badgeVariant}
									onToggleActive={handleToggleActive}
									isToggling={activeToggleId === user.id}
									onDelete={handleDeleteUser}
									isDeleting={activeDeleteId === user.id}
								/>
							</Col>
						))}
					</Row>
				)}
			</Container>
		</div>
	);
};

export default DashboardAdmin;
