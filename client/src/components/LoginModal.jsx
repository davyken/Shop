import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiX } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function LoginModal({ open, onClose }) {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  if (!open) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!identifier || !password) return toast.error('Enter your login details')

    setLoading(true)
    try {
      await login(identifier, password)
      onClose?.()
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    }
    setLoading(false)
  }

  return (
    <div className="bb-modal-backdrop" role="dialog" aria-modal="true">
      <div className="bb-modal">
        <div className="bb-modal-head">
          <h3>Login required</h3>
          <button className="bb-modal-close" onClick={onClose} aria-label="Close">
            <FiX />
          </button>
        </div>
        <p className="bb-modal-sub">Please sign in to create a listing.</p>

        <form className="bb-auth-form" onSubmit={handleSubmit}>
          <label>
            Email or Username
            <input
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. demo@site.com or demoUser"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </label>

          <button className="btn btn-primary" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="bb-auth-links">
            <span>New here?</span>
            <Link to="/register" onClick={onClose}>Create an account</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

