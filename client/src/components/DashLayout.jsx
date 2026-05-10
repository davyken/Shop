import { NavLink, useNavigate } from 'react-router-dom'
import { FiGrid, FiShoppingBag, FiPackage, FiPlusCircle, FiUser, FiLogOut, FiShoppingCart } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import './DashLayout.css'

const navItems = [
  { to: '/dashboard', icon: <FiGrid />, label: 'Dashboard' },
  { to: '/shop', icon: <FiShoppingBag />, label: 'Browse Shop' },
  { to: '/my-products', icon: <FiPackage />, label: 'My Products' },
  { to: '/add-product', icon: <FiPlusCircle />, label: 'Add Product' },
  { to: '/orders', icon: <FiShoppingCart />, label: 'My Orders' },
  { to: '/profile', icon: <FiUser />, label: 'Profile' },
]

export default function DashLayout({ children, title }) {
  const { user, logout } = useAuth()
  const { count } = useCart()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <div className="dash-wrap">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span>🍼</span>
          <span className="sidebar-brand">Blessing<br /><small>Babyshop</small></span>
        </div>
        <div className="sidebar-user">
          {user?.profilePic
            ? <img src={user.profilePic} className="avatar avatar-lg" alt="user" />
            : <div className="avatar avatar-lg">{user?.name?.[0]?.toUpperCase()}</div>}
          <p className="sidebar-name">{user?.name}</p>
          <p className="sidebar-role">@{user?.username}</p>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              {item.icon}
              <span>{item.label}</span>
              {item.to === '/orders' && count > 0 && <span className="nav-badge">{count}</span>}
            </NavLink>
          ))}
        </nav>
        <button className="sidebar-logout" onClick={handleLogout}><FiLogOut /> Logout</button>
      </aside>

      <main className="dash-main">
        <div className="dash-content page-enter">{children}</div>
      </main>
    </div>
  )
}
