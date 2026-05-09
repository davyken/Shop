import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiEye, FiEyeOff, FiUserPlus } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import './Auth.css'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', name: '', email: '', password: '', confirmPassword: '', role: 'both' })
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match')
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters')
    setLoading(true)
    try {
      await register({ username: form.username, name: form.name, email: form.email, password: form.password, role: form.role })
      toast.success('Account created! Welcome 🎉')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <span className="auth-logo">🍼</span>
          <h1>Blessing Babyshop</h1>
          <p>Join thousands of parents across Cameroon</p>
        </div>
        <div className="auth-deco">
          {['👶','🧸','🍼','👗','🚗','💛'].map((e,i) => <span key={i} className={`deco-item di${i+1}`}>{e}</span>)}
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-card">
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-sub">It's free and takes less than a minute</p>

          <form onSubmit={submit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input name="name" className="form-input" value={form.name} onChange={handle} placeholder="Your full name" required />
              </div>
              <div className="form-group">
                <label className="form-label">Username</label>
                <input name="username" className="form-input" value={form.username} onChange={handle} placeholder="@username" required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input name="email" type="email" className="form-input" value={form.email} onChange={handle} placeholder="your@email.com" required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrap">
                <input name="password" type={showPass ? 'text' : 'password'} className="form-input"
                  value={form.password} onChange={handle} placeholder="Min. 6 characters" required />
                <button type="button" className="input-icon" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="input-wrap">
                <input name="confirmPassword" type={showConfirm ? 'text' : 'password'} className="form-input"
                  value={form.confirmPassword} onChange={handle} placeholder="Repeat password" required />
                <button type="button" className="input-icon" onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">I want to</label>
              <select name="role" className="form-select" value={form.role} onChange={handle}>
                <option value="both">Buy &amp; Sell</option>
                <option value="buyer">Buy Only</option>
                <option value="seller">Sell Only</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
              {loading ? <span className="spinner" /> : <><FiUserPlus /> Create Account</>}
            </button>
          </form>

          <p className="auth-switch">Already have an account? <Link to="/login">Sign In</Link></p>
        </div>
      </div>
    </div>
  )
}
