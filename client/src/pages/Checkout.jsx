import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiSend, FiUser, FiPhone } from 'react-icons/fi'
import DashLayout from '../components/DashLayout'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import './Checkout.css'

const WHATSAPP_PHONE = '+254728721142'

export default function Checkout() {
  const { items, updateQty, removeItem, clearCart, total, count } = useCart()
  const { user } = useAuth()
  const [processing, setProcessing] = useState(false)
  const [whatsappSubmitted, setWhatsappSubmitted] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')

  useEffect(() => {
    if (user) {
      setCustomerName(user.name)
      setCustomerPhone(user.phone || user.email || '')
    }
  }, [user])

  const handlePay = async () => {
    if (items.length === 0) return toast.error('Cart is empty')

    let name = customerName
    let phone = customerPhone

    if (user) {
      name = user.name
      phone = user.phone || user.email || ''
    } else {
      if (!name.trim()) return toast.error('Please enter your name')
      if (!phone.trim()) return toast.error('Please enter your phone number')
    }

    setProcessing(true)

    const itemText = items
      .map((i) => `- ${i.title} (x${i.qty}) - ZES ${(i.price * i.qty).toLocaleString()}`)
      .join('\n')

    const customerInfo = user 
      ? `\n\nCustomer: ${name}${phone ? ` (${phone})` : ''}`
      : `\n\nCustomer: ${name}\nPhone: ${phone}`
    const message = `Hello, I want to order:${itemText}${customerInfo}\n\n*Total: ZES ${total.toLocaleString()}*`

    window.open(
      `https://wa.me/${WHATSAPP_PHONE.replace('+', '')}?text=${encodeURIComponent(message)}`,
      '_blank'
    )

    clearCart()
    setWhatsappSubmitted(true)
    setProcessing(false)
  }

  if (whatsappSubmitted) {
    return (
      <DashLayout title="WhatsApp Order">
        <div className="whatsapp-sent-page">
          <div className="whatsapp-sent-card">
            <div className="whatsapp-sent-icon">
              <FiSend />
            </div>
            <h2>Order Sent to WhatsApp!</h2>
            <p>We opened WhatsApp in a new tab. Please send the message to confirm your order.</p>
            <div className="success-actions">
              <Link to="/shop" className="btn btn-primary btn-lg">
                <FiShoppingBag /> Continue Shopping
              </Link>
              <Link to="/checkout" className="btn btn-ghost" onClick={() => setWhatsappSubmitted(false)}>
                New Order
              </Link>
            </div>
          </div>
        </div>
      </DashLayout>
    )
  }

  return (
    <DashLayout title="Checkout">
      <div className="checkout-page">
        <div className="checkout-left">
          <div className="card">
            <h3 className="section-h">🛒 Cart ({count} items)</h3>
            {items.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🛒</div>
                <p>Your cart is empty.</p>
                <Link to="/shop" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                  Browse Shop
                </Link>
              </div>
            ) : (
              <div className="cart-items">
                {items.map((item) => (
                  <div key={item._id} className="cart-item">
                    <img
                      src={item.images?.[0]?.url || 'https://picsum.photos/seed/cart1/60/60'}
                      alt={item.title}
                    />
                    <div className="cart-item-info">
                      <p className="ci-title">{item.title}</p>
                      <p className="ci-price">ZES {Number(item.price).toLocaleString()}</p>
                    </div>
                    <div className="qty-ctrl">
                      <button className="qty-btn" onClick={() => updateQty(item._id, item.qty - 1)}>
                        <FiMinus />
                      </button>
                      <span>{item.qty}</span>
                      <button className="qty-btn" onClick={() => updateQty(item._id, item.qty + 1)}>
                        <FiPlus />
                      </button>
                    </div>
                    <p className="ci-subtotal">ZES {(item.price * item.qty).toLocaleString()}</p>
                    <button className="btn btn-danger btn-sm" onClick={() => removeItem(item._id)}>
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
                <div className="cart-total">
                  <span>Total</span>
                  <strong>ZES {total.toLocaleString()}</strong>
                </div>
              </div>
            )}
          </div>
        </div>

        {items.length > 0 && (
          <div className="checkout-right">
            <div className="card">
              <h3 className="section-h">💬 Order via WhatsApp</h3>
               <div className="pay-summary">
                <div className="pay-row">
                  <span>Subtotal</span>
                  <span>ZES {total.toLocaleString()}</span>
                </div>
                <div className="pay-row">
                  <span>Delivery</span>
                  <span className="text-green">Free</span>
                </div>
                <div className="pay-row total">
                  <span>Total</span>
                  <strong>ZES {total.toLocaleString()}</strong>
                </div>
              </div>

              {!user && (
                <div className="guest-info-form">
                  <h4>Your Contact Info</h4>
                  <div className="form-group">
                    <label><FiUser /> Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Your full name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label><FiPhone /> Phone</label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="+254..."
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <button className="btn btn-primary btn-lg pay-btn" onClick={handlePay} disabled={processing}>
                {processing ? <><span className="spinner" /> Sending...</> : <>Order via WhatsApp →</>}
              </button>

              <p className="pay-secure">Send the message on WhatsApp to confirm your order.</p>
            </div>
          </div>
        )}
      </div>
    </DashLayout>
  )
}

