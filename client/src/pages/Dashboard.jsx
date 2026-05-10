import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiPackage, FiShoppingBag, FiPlusCircle, FiTrendingUp } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import DashLayout from '../components/DashLayout'
import api from '../api/axios'
import './Dashboard.css'

export default function Dashboard() {
  const { user } = useAuth()
  const { count, total } = useCart()
  const [myProducts, setMyProducts] = useState([])
  const [recentProducts, setRecentProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const [myRes, shopRes] = await Promise.all([
          api.get('/api/products/my'),
          api.get('/api/products?limit=4'),
        ])
        setMyProducts(myRes.data.products)
        setRecentProducts(shopRes.data.products)
      } catch {}
      setLoading(false)
    }
    fetch()
  }, [])

  const stats = [
    { icon: <FiPackage />, label: 'My Listings', value: myProducts.length, color: 'pink', link: '/my-products' },
    { icon: <FiShoppingBag />, label: 'Cart Items', value: count, color: 'blue', link: '/checkout' },
    { icon: <FiTrendingUp />, label: 'Cart Total', value: `ZES ${total.toLocaleString()}`, color: 'amber', link: '/checkout' },
    { icon: <FiPlusCircle />, label: 'Add Product', value: 'Sell Now', color: 'teal', link: '/add-product' },
  ]

  return (
    <DashLayout title="Dashboard">
      <div className="dash-home">
        <div className="dash-welcome">
          <div>
            <h2>Hello, {user?.name?.split(' ')[0]}! 👋</h2>
            <p>Here's what's happening in your shop today.</p>
          </div>
          <Link to="/add-product" className="btn btn-primary"><FiPlusCircle /> Add Product</Link>
        </div>

        <div className="stats-grid">
          {stats.map((s, i) => (
            <Link key={i} to={s.link} className={`stat-card stat-${s.color}`}>
              <div className="stat-icon">{s.icon}</div>
              <div>
                <p className="stat-value">{s.value}</p>
                <p className="stat-label">{s.label}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="dash-sections">
          <div className="dash-section">
            <div className="section-header">
              <h3>My Recent Products</h3>
              <Link to="/my-products" className="btn btn-ghost btn-sm">View All</Link>
            </div>
            {loading ? <p className="text-muted">Loading...</p> : myProducts.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <p>No products yet. <Link to="/add-product">Add your first!</Link></p>
              </div>
            ) : (
              <div className="mini-product-list">
                {myProducts.slice(0,4).map(p => (
                  <div key={p._id} className="mini-product">
                    <img src={p.images?.[0]?.url || 'https://picsum.photos/seed/dashboard1/50/50'} alt={p.title} />
                    <div>
                      <p className="mini-title">{p.title}</p>
                      <p className="mini-price">ZES {Number(p.price).toLocaleString()}</p>
                    </div>
                    <span className={`badge badge-${p.status}`}>{p.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="dash-section">
            <div className="section-header">
              <h3>Latest in Shop</h3>
              <Link to="/shop" className="btn btn-ghost btn-sm">Browse All</Link>
            </div>
            {loading ? <p className="text-muted">Loading...</p> : (
              <div className="mini-product-list">
                {recentProducts.map(p => (
                  <div key={p._id} className="mini-product">
                    <img src={p.images?.[0]?.url || 'https://picsum.photos/seed/dashboard1/50/50'} alt={p.title} />
                    <div>
                      <p className="mini-title">{p.title}</p>
                      <p className="mini-price">ZES {Number(p.price).toLocaleString()}</p>
                    </div>
                    <span className={`badge badge-${p.status}`}>{p.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashLayout>
  )
}
