import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import api from '../api/axios'
import toast from 'react-hot-toast'
import './Auth.css'

export default function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ password: '', confirm: '' })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) return toast.error('Passwords do not match')
    if (form.password.length < 6) return toast.error('Min. 6 characters')
    setLoading(true)
    try {
      await api.post(`/api/auth/reset-password/${token}`, { password: form.password })
      toast.success('Password reset! Please login.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <span className="auth-logo">🔒</span>
          <h1>Set New Password</h1>
          <p>Choose a strong password</p>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-card">
          <h2 className="auth-title">New Password</h2>
          <p className="auth-sub">Enter and confirm your new password</p>
          <form onSubmit={submit}>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <div className="input-wrap">
                <input type={show ? 'text' : 'password'} className="form-input"
                  value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Min. 6 characters" required />
                <button type="button" className="input-icon" onClick={() => setShow(!show)}>
                  {show ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="input-wrap">
                <input type={show ? 'text' : 'password'} className="form-input"
                  value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                  placeholder="Repeat password" required />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
              {loading ? <span className="spinner" /> : 'Reset Password'}
            </button>
          </form>
          <p className="auth-switch"><Link to="/login">Back to Login</Link></p>
        </div>
      </div>
    </div>
  )
}
