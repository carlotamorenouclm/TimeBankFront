import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import DashboardUser from './pages/DashboardUser'
import DashboardAdmin from './pages/DashboardAdmin'

import ProtectedRoute from './utils/ProtectedRoute'
import { isAuthenticated } from './utils/AuthHelpers';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route element={<ProtectedRoute canAccess={isAuthenticated} />}>
        <Route path="/dashboarduser" element={<DashboardUser />} />
      </Route>
      <Route element={<ProtectedRoute canAccess={isAuthenticated} redirectPath="/dashboarduser" />}>
        <Route path="/dashboardadmin" element={<DashboardAdmin />} />
      </Route>
    </Routes>
  )
}
export default App