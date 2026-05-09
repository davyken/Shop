import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiEye, FiEyeOff, FiLogIn } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import './Auth.css'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ identifier: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(form.identifier, form.password)
      toast.success('Welcome back! 🎉')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
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
          <p>Your trusted baby marketplace in Cameroon</p>
        </div>
        <div className="auth-deco">
          {['👶','🧸','🍼','👗','🚗','💛'].map((e,i) => <span key={i} className={`deco-item di${i+1}`}>{e}</span>)}
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-card">
          <h2 className="auth-title">Welcome Back!</h2>
          <p className="auth-sub">Sign in to continue shopping</p>

          <form onSubmit={submit}>
            <div className="form-group">
              <label className="form-label">Email or Username</label>
              <input name="identifier" className="form-input" value={form.identifier}
                onChange={handle} placeholder="Enter email or username" required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrap">
                <input name="password" type={showPass ? 'text' : 'password'} className="form-input"
                  value={form.password} onChange={handle} placeholder="Enter password" required />
                <button type="button" className="input-icon" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
            <div className="auth-forgot">
              <Link to="/forgot-password">Forgot password?</Link>
            </div>
            <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
              {loading ? <span className="spinner" /> : <><FiLogIn /> Sign In</>}
            </button>
          </form>

          <p className="auth-switch">Don't have an account? <Link to="/register">Register</Link></p>
        </div>
      </div>
    </div>
  )
}
