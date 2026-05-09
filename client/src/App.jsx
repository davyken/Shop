import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import api from './api/axios'

// Pages
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Dashboard from './pages/Dashboard'
import Shop from './pages/Shop'
import MyProducts from './pages/MyProducts'
import AddProduct from './pages/AddProduct'
import EditProduct from './pages/EditProduct'
import Profile from './pages/Profile'
import Orders from './pages/Orders'
import Checkout from './pages/Checkout'

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { user } = useAuth()
  return !user ? children : <Navigate to="/dashboard" replace />
}

function KeepAlive() {
  useEffect(() => {
    const ping = () => api.get('/api/ping').catch(() => {})
    ping()
    const id = setInterval(ping, 5 * 60 * 1000)
    return () => clearInterval(id)
  }, [])
  return null
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <KeepAlive />
          <Toaster
            position="top-right"
            toastOptions={{
              style: { fontFamily: 'Nunito, sans-serif', fontWeight: 700, borderRadius: 12 },
              success: { style: { background: '#D5F5E3', color: '#1a7340' } },
              error: { style: { background: '#FADBD8', color: '#7b1c15' } },
            }}
          />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/shop" element={<PrivateRoute><Shop /></PrivateRoute>} />
            <Route path="/my-products" element={<PrivateRoute><MyProducts /></PrivateRoute>} />
            <Route path="/add-product" element={<PrivateRoute><AddProduct /></PrivateRoute>} />
            <Route path="/edit-product/:id" element={<PrivateRoute><EditProduct /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
            <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}
