// Define el arbol principal de rutas del frontend y protege las zonas privadas.
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import DashboardUser from './pages/DashboardUser'
import MyServices from './pages/MyServices'
import DashboardAdmin from './pages/DashboardAdmin'
import EditUser from './pages/EditUser'
import History from './pages/History';
import Inbox from './pages/Inbox';
import Wallet from './pages/Wallet';
import ProfileUser from './pages/ProfileUser';
import UserPortalLayout from './components/UserPortalLayout';

import ProtectedRoute from './utils/ProtectedRoute'
import { isAuthenticated } from './utils/AuthHelpers';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route element={<ProtectedRoute canAccess={isAuthenticated} />}>
        <Route element={<UserPortalLayout canAccess={isAuthenticated} />}>
          <Route path="/dashboarduser" element={<DashboardUser />} />
          <Route path="/my-services" element={<MyServices />} />
          <Route path="/history" element={<History />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/profile" element={<ProfileUser />} />
        </Route>
      </Route>
      <Route element={<ProtectedRoute canAccess={isAuthenticated} redirectPath="/dashboarduser" />}>
        <Route path="/dashboardadmin" element={<DashboardAdmin />} />
        <Route path="/users/:userId/edit" element={<EditUser />} />
      </Route>
    </Routes>
  )
}
export default App
