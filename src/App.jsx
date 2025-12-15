import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Inventory from './pages/Inventory'
import Sales from './pages/Sales'
import Clients from './pages/Clients'
import Reports from './pages/Reports'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/inventario" element={<PrivateRoute><Inventory /></PrivateRoute>} />
          <Route path="/ventas" element={<PrivateRoute><Sales /></PrivateRoute>} />
          <Route path="/clientes" element={<PrivateRoute><Clients /></PrivateRoute>} />
          <Route path="/reportes" element={<PrivateRoute><Reports /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
