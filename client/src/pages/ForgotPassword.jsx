import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import toast from 'react-hot-toast'
import './Auth.css'

export function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/api/auth/forgot-password', { email })
      setSent(true)
      toast.success('Reset link sent!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <span className="auth-logo">🔑</span>
          <h1>Forgot Password?</h1>
          <p>No worries, we'll send you a reset link</p>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-card">
          <h2 className="auth-title">Reset Password</h2>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📧</div>
              <p style={{ color: 'var(--text2)', marginBottom: '1.5rem' }}>
                We sent a reset link to <strong>{email}</strong>. Check your inbox and follow the instructions.
              </p>
              <Link to="/login" className="btn btn-primary">Back to Login</Link>
            </div>
          ) : (
            <>
              <p className="auth-sub">Enter your email to receive a reset link</p>
              <form onSubmit={submit}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-input" value={email}
                    onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required />
                </div>
                <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
                  {loading ? <span className="spinner" /> : 'Send Reset Link'}
                </button>
              </form>
              <p className="auth-switch"><Link to="/login">Back to Login</Link></p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
