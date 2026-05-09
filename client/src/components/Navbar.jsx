import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { FiShoppingCart, FiMenu, FiX, FiUser, FiLogOut, FiPackage, FiPlusCircle, FiShoppingBag } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import './Navbar.css'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { count } = useCart()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to={user ? '/dashboard' : '/'} className="navbar-brand">
          <span className="brand-icon">🍼</span>
          <span className="brand-text">Blessing <span>Babyshop</span></span>
        </Link>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          {!user ? (
            <>
              <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
              <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="btn btn-primary btn-sm">Register</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link to="/shop" onClick={() => setMenuOpen(false)}>Shop</Link>
              <Link to="/my-products" onClick={() => setMenuOpen(false)}>My Products</Link>
              <Link to="/add-product" onClick={() => setMenuOpen(false)}>Sell</Link>
            </>
          )}
        </div>

        <div className="navbar-actions">
          {user && (
            <Link to="/checkout" className="cart-btn">
              <FiShoppingCart />
              {count > 0 && <span className="cart-badge">{count}</span>}
            </Link>
          )}

          {user && (
            <div className="user-drop" onMouseLeave={() => setDropOpen(false)}>
              <button className="user-btn" onClick={() => setDropOpen(!dropOpen)}>
                {user.profilePic
                  ? <img src={user.profilePic} alt="avatar" className="avatar" />
                  : <div className="avatar">{user.name?.[0]?.toUpperCase()}</div>}
              </button>
              {dropOpen && (
                <div className="drop-menu">
                  <p className="drop-name">{user.name}</p>
                  <p className="drop-email">{user.email}</p>
                  <hr />
                  <Link to="/profile" onClick={() => setDropOpen(false)}><FiUser /> Profile</Link>
                  <Link to="/my-products" onClick={() => setDropOpen(false)}><FiPackage /> My Products</Link>
                  <Link to="/add-product" onClick={() => setDropOpen(false)}><FiPlusCircle /> Add Product</Link>
                  <Link to="/orders" onClick={() => setDropOpen(false)}><FiShoppingBag /> My Orders</Link>
                  <hr />
                  <button onClick={handleLogout}><FiLogOut /> Logout</button>
                </div>
              )}
            </div>
          )}

          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
    </nav>
  )
}
