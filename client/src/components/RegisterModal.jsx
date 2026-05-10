import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiX } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function RegisterModal({ open, onClose }) {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  if (!open) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username || !name || !email || !password) return toast.error('All fields are required')

    setLoading(true)
    try {
      await register({ username, name, email, password })
      onClose?.()
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    }
    setLoading(false)
  }

  return (
    <div className="bb-modal-backdrop" role="dialog" aria-modal="true">
      <div className="bb-modal">
        <div className="bb-modal-head">
          <h3>Create your account</h3>
          <button className="bb-modal-close" onClick={onClose} aria-label="Close">
            <FiX />
          </button>
        </div>
        <p className="bb-modal-sub">Create an account to list your baby products.</p>

        <form className="bb-auth-form" onSubmit={handleSubmit}>
          <div className="bb-grid-2">
            <label>
              Username
              <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g. john123" />
            </label>
            <label>
              Full name
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" />
            </label>
          </div>

          <label>
            Email
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" />
          </label>

          <label>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimum 6 chars" />
          </label>

          <button className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create account'}
          </button>

          <div className="bb-auth-links">
            <span>Already have an account?</span>
            <Link to="/login" onClick={onClose}>Login</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

