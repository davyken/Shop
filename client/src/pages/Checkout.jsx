import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FiTrash2, FiPlus, FiMinus, FiCheckCircle, FiShoppingBag } from 'react-icons/fi'
import DashLayout from '../components/DashLayout'
import { useCart } from '../context/CartContext'
import api from '../api/axios'
import toast from 'react-hot-toast'
import './Checkout.css'

const PAYMENT_METHODS = [
  { id: 'visa', label: 'Visa / Mastercard', icon: '💳', color: '#1a1f71' },
  { id: 'orange', label: 'Orange Money', icon: '🟠', color: '#FF6600' },
  { id: 'momo', label: 'MTN MoMo', icon: '📱', color: '#FFCC00' },
  { id: 'stripe', label: 'Stripe', icon: '⚡', color: '#635BFF' },
]

export default function Checkout() {
  const { items, updateQty, removeItem, clearCart, total, count } = useCart()
  const navigate = useNavigate()
  const [method, setMethod] = useState('visa')
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(null)
  const [payFields, setPayFields] = useState({ cardNumber: '', expiry: '', cvv: '', name: '', phone: '' })

  const handlePay = async () => {
    if (items.length === 0) return toast.error('Cart is empty')
    setProcessing(true)
    await new Promise(r => setTimeout(r, 2200))
    try {
      const { data } = await api.post('/api/orders', {
        items: items.map(i => ({ productId: i._id, quantity: i.qty })),
        paymentMethod: method,
        paymentDetails: payFields,
      })
      clearCart()
      setSuccess(data.order)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed')
    }
    setProcessing(false)
  }

  if (success) {
    return (
      <DashLayout title="Order Confirmed">
        <div className="success-page">
          <div className="success-card">
            <div className="success-icon">🎉</div>
            <h2>Payment Successful!</h2>
            <p>Your order has been placed and is being processed.</p>
            <div className="order-info">
              <div className="order-row"><span>Order Number</span><strong>{success.orderNumber}</strong></div>
              <div className="order-row"><span>Total Paid</span><strong>XAF {Number(success.totalPrice).toLocaleString()}</strong></div>
              <div className="order-row"><span>Payment Method</span><strong style={{ textTransform: 'capitalize' }}>{success.paymentMethod}</strong></div>
              <div className="order-row"><span>Status</span><span className="badge badge-available">✅ Paid</span></div>
            </div>
            <div className="success-actions">
              <Link to="/shop" className="btn btn-primary btn-lg"><FiShoppingBag /> Continue Shopping</Link>
              <Link to="/orders" className="btn btn-ghost">View Orders</Link>
            </div>
          </div>
        </div>
      </DashLayout>
    )
  }

  return (
    <DashLayout title="Checkout">
      <div className="checkout-page">
        {/* Cart */}
        <div className="checkout-left">
          <div className="card">
            <h3 className="section-h">🛒 Cart ({count} items)</h3>
            {items.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🛒</div>
                <p>Your cart is empty.</p>
                <Link to="/shop" className="btn btn-primary" style={{ marginTop: '1rem' }}>Browse Shop</Link>
              </div>
            ) : (
              <div className="cart-items">
                {items.map(item => (
                  <div key={item._id} className="cart-item">
                    <img src={item.images?.[0]?.url || 'https://via.placeholder.com/60'} alt={item.title} />
                    <div className="cart-item-info">
                      <p className="ci-title">{item.title}</p>
                      <p className="ci-price">XAF {Number(item.price).toLocaleString()}</p>
                    </div>
                    <div className="qty-ctrl">
                      <button className="qty-btn" onClick={() => updateQty(item._id, item.qty - 1)}><FiMinus /></button>
                      <span>{item.qty}</span>
                      <button className="qty-btn" onClick={() => updateQty(item._id, item.qty + 1)}><FiPlus /></button>
                    </div>
                    <p className="ci-subtotal">XAF {(item.price * item.qty).toLocaleString()}</p>
                    <button className="btn btn-danger btn-sm" onClick={() => removeItem(item._id)}><FiTrash2 /></button>
                  </div>
                ))}
                <div className="cart-total">
                  <span>Total</span>
                  <strong>XAF {total.toLocaleString()}</strong>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Payment */}
        {items.length > 0 && (
          <div className="checkout-right">
            <div className="card">
              <h3 className="section-h">💳 Payment Method</h3>
              <div className="payment-methods">
                {PAYMENT_METHODS.map(m => (
                  <label key={m.id} className={`pm-option ${method === m.id ? 'selected' : ''}`}
                    style={{ '--pm-color': m.color }}>
                    <input type="radio" name="method" value={m.id} checked={method === m.id} onChange={() => setMethod(m.id)} hidden />
                    <span className="pm-icon">{m.icon}</span>
                    <span>{m.label}</span>
                    {method === m.id && <FiCheckCircle className="pm-check" />}
                  </label>
                ))}
              </div>

              {/* Dynamic payment fields */}
              <div className="pay-fields">
                {method === 'visa' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Cardholder Name</label>
                      <input className="form-input" placeholder="John Doe" value={payFields.name}
                        onChange={e => setPayFields({ ...payFields, name: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Card Number</label>
                      <input className="form-input" placeholder="1234 5678 9012 3456" maxLength={19}
                        value={payFields.cardNumber}
                        onChange={e => setPayFields({ ...payFields, cardNumber: e.target.value.replace(/(\d{4})/g, '$1 ').trim() })} />
                    </div>
                    <div className="form-row-pay">
                      <div className="form-group">
                        <label className="form-label">Expiry</label>
                        <input className="form-input" placeholder="MM/YY" maxLength={5}
                          value={payFields.expiry} onChange={e => setPayFields({ ...payFields, expiry: e.target.value })} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">CVV</label>
                        <input className="form-input" placeholder="123" maxLength={3}
                          value={payFields.cvv} onChange={e => setPayFields({ ...payFields, cvv: e.target.value })} />
                      </div>
                    </div>
                  </>
                )}
                {method === 'stripe' && (
                  <>
                    <div className="stripe-demo-note">⚡ Stripe Demo Mode — no real charge</div>
                    <div className="form-group">
                      <label className="form-label">Test Card Number</label>
                      <input className="form-input" defaultValue="4242 4242 4242 4242" readOnly />
                    </div>
                    <div className="form-row-pay">
                      <div className="form-group"><label className="form-label">Expiry</label><input className="form-input" placeholder="12/26" /></div>
                      <div className="form-group"><label className="form-label">CVC</label><input className="form-input" placeholder="123" /></div>
                    </div>
                  </>
                )}
                {(method === 'orange' || method === 'momo') && (
                  <div className="form-group">
                    <label className="form-label">{method === 'orange' ? 'Orange' : 'MTN'} Phone Number</label>
                    <input className="form-input" placeholder="+237 6XX XXX XXX"
                      value={payFields.phone} onChange={e => setPayFields({ ...payFields, phone: e.target.value })} />
                    <p className="field-hint">You will receive a payment prompt on this number.</p>
                  </div>
                )}
              </div>

              <div className="pay-summary">
                <div className="pay-row"><span>Subtotal</span><span>XAF {total.toLocaleString()}</span></div>
                <div className="pay-row"><span>Delivery</span><span className="text-green">Free</span></div>
                <div className="pay-row total"><span>Total</span><strong>XAF {total.toLocaleString()}</strong></div>
              </div>

              <button className="btn btn-primary btn-lg pay-btn" onClick={handlePay} disabled={processing}>
                {processing ? (
                  <><span className="spinner" /> Processing payment...</>
                ) : (
                  <>Pay XAF {total.toLocaleString()} →</>
                )}
              </button>
              <p className="pay-secure">🔒 Your payment is secured and encrypted</p>
            </div>
          </div>
        )}
      </div>
    </DashLayout>
  )
}
