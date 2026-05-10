import { useEffect, useState } from 'react'
import DashLayout from '../components/DashLayout'
import api from '../api/axios'
import './Orders.css'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/orders/my').then(({ data }) => setOrders(data.orders)).finally(() => setLoading(false))
  }, [])

  return (
    <DashLayout title="My Orders">
      <div className="orders-page">
        {loading ? <p>Loading orders...</p> : orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <p>No orders yet. Start shopping!</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order._id} className="order-card card">
                <div className="order-header">
                  <div>
                    <p className="order-num">Order #{order.orderNumber}</p>
                    <p className="order-date">{new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <div className="order-meta">
                    <span className="badge badge-available">✅ {order.status}</span>
                    <span className="order-total">ZES {Number(order.totalPrice).toLocaleString()}</span>
                  </div>
                </div>
                <div className="order-items">
                  {order.items.map((item, i) => (
                    <div key={i} className="order-item">
                      {item.image && <img src={item.image} alt={item.title} />}
                      <span>{item.title}</span>
                      <span className="oi-qty">×{item.quantity}</span>
                      <span className="oi-price">ZES {Number(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="order-footer">
                  <span className="pm-tag">💳 {order.paymentMethod?.toUpperCase()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashLayout>
  )
}
