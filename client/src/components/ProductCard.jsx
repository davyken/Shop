import { Link } from 'react-router-dom'
import { FiEdit2, FiTrash2, FiShoppingCart, FiStar } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'
import './ProductCard.css'

const STATUS_LABEL = { available: 'Available', finished: 'Finished', in_stock: 'In Stock' }

export default function ProductCard({ product, onDelete }) {
  const { user } = useAuth()
  const { addItem } = useCart()
  const isOwner = user?._id === product.seller?._id || user?._id === product.seller

  const handleAddToCart = () => {
    if (product.status === 'finished') return toast.error('This product is out of stock')
    addItem(product)
    toast.success('Added to cart! 🛒')
  }

  const img = product.images?.[0]?.url || 'https://via.placeholder.com/300x200?text=No+Image'

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
ZES {Number(product.price).toLocaleString()}
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
              <button
                className="btn btn-primary btn-sm"
                onClick={handleAddToCart}
                disabled={product.status === 'finished'}
              >
                <FiShoppingCart /> Add
              </button>
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
