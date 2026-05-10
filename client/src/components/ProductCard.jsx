import { Link } from 'react-router-dom'
import { FiEdit2, FiTrash2, FiShoppingCart, FiStar, FiSend } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'
import './ProductCard.css'

const STATUS_LABEL = { available: 'Available', finished: 'Finished', in_stock: 'In Stock' }
const WHATSAPP_PHONE = '+254728721142'

export default function ProductCard({ product, onDelete }) {
  const { user } = useAuth()
  const { addItem } = useCart()
  const isOwner = user?._id === product.seller?._id || user?._id === product.seller

  const handleAddToCart = () => {
    if (product.status === 'finished') return toast.error('This product is out of stock')
    addItem(product)
    toast.success('Added to cart! 🛒')
  }

  const handleOrderOnWhatsApp = () => {
    if (product.status === 'finished') return toast.error('This product is out of stock')
    
    const message = `Hello, I want to order:\n- ${product.title} (x1) - ZES ${Number(product.price).toLocaleString()}\n\nCustomer: ${user ? user.name : 'Guest'}\n\nTotal: ZES ${Number(product.price).toLocaleString()}`
    
    window.open(
      `https://wa.me/${WHATSAPP_PHONE.replace('+', '')}?text=${encodeURIComponent(message)}`,
      '_blank'
    )
    toast.success('Opening WhatsApp...')
  }

  const img = product.images?.[0]?.url || 'https://picsum.photos/seed/baby1/300/200'

  return (
    <div className="product-card">
      <div className="product-img-wrap">
        <img src={img} alt={product.title} className="product-img" />
        <span className={`badge badge-${product.status} product-status-badge`}>
          {STATUS_LABEL[product.status]}
          {product.status === 'in_stock' && ` (${product.stockCount})`}
        </span>
      </div>
      <div className="product-body">
        <p className="product-category">{product.category?.name || 'Uncategorized'}</p>
        <h3 className="product-title">{product.title}</h3>
        <p className="product-desc">{product.description?.slice(0, 70)}{product.description?.length > 70 ? '...' : ''}</p>
        <div className="product-footer">
          <div className="product-price">
            ZES {Number(product.price).toLocaleString()}
          </div>
<div className="product-actions">
              {isOwner ? (
                <>
                  <Link to={`/edit-product/${product._id}`} className="btn btn-ghost btn-sm" title="Edit">
                    <FiEdit2 />
                  </Link>
                  {onDelete && (
                    <button className="btn btn-danger btn-sm" onClick={() => onDelete(product._id)} title="Delete">
                      <FiTrash2 />
                    </button>
                  )}
                </>
              ) : (
                <>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={handleAddToCart}
                    disabled={product.status === 'finished'}
                  >
                    <FiShoppingCart />
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={handleOrderOnWhatsApp}
                    disabled={product.status === 'finished'}
                  >
                    <FiSend />
                  </button>
                </>
              )}
            </div>
        </div>
        {product.seller?.name && (
          <p className="product-seller">by {product.seller.name}</p>
        )}
      </div>
    </div>
  )
}
