import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { FiSend, FiShoppingCart, FiTrash2, FiEdit2, FiUser, FiPhone } from 'react-icons/fi'
import DashLayout from '../components/DashLayout'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import toast from 'react-hot-toast'
import StickyWhatsAppButton from '../components/StickyWhatsAppButton'
import './ProductDetails.css'

export default function ProductDetails() {
  const { user } = useAuth()
  const { addItem, updateQty, removeItem, count } = useCart()
  const navigate = useNavigate()
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [processing, setProcessing] = useState(false)

  const fetchProduct = async () => {
    try {
      const { data } = await api.get(`/api/products/${id}`)
      setProduct(data.product)
      setQty(1)
    } catch (err) {
      toast.error('Product not found')
      navigate('/shop')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    if (!product) return
    if (product.status === 'finished') return toast.error('This product is out of stock')
    const productWithQty = { ...product, qty }
    addItem(productWithQty)
    toast.success('Added to cart! 🛒')
    navigate('/cart')
  }

  const handleIncreaseQty = () => {
    if (product && qty < (product.stockCount || 999)) {
      setQty(qty + 1)
    }
  }

  const handleDecreaseQty = () => {
    if (qty > 1) {
      setQty(qty - 1)
    }
  }

  const handleOrderOnWhatsApp = () => {
    if (!product) return

    setProcessing(true)
    const message = `Hello, I want to order ${product.title}, Quantity: ${qty}`
    
    // Optional: include price
    // const messageWithPrice = `Hello, I want to order ${product.title}, Quantity: ${qty}, Price: ZES ${(product.price * qty).toLocaleString()}`

    window.open(
      `https://wa.me/237XXXXXXXXX?text=${encodeURIComponent(message)}`,
      '_blank'
    )

    setProcessing(false)
  }

  if (loading || !product) {
    return (
      <DashLayout title="Product Details">
        <div className="loading-page">
          <div className="loading-spinner" />
          <p>Loading product details...</p>
        </div>
      </DashLayout>
    )
  }

  return (
    <DashLayout title={product.title}>
      <StickyWhatsAppButton productName={product.title} />
      
      <div className="product-details-page">
        <div className="product-details-content">
          {/* Product Images */}
          <div className="product-images">
            <div className="main-image">
              <img 
                src={product.images?.[0]?.url || 'https://picsum.photos/seed/prod1/600/400'} 
                alt={product.title} 
              />
            </div>
            {product.images?.length > 1 && (
              <div className="thumbnail-images">
                {product.images.slice(1, 4).map((img, index) => (
                  <img 
                    key={index} 
                    src={img.url} 
                    alt={`${product.title} ${index + 1}`} 
                    className={index === 0 ? 'active' : ''}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-info">
            <div className="product-header">
              <h1 className="product-title">{product.title}</h1>
              <span className={`product-status-badge badge-${product.status}`}>
                {product.status === 'in_stock' && `In Stock (${product.stockCount})`}
                {product.status === 'available' && 'Available'}
                {product.status === 'finished' && 'Out of Stock'}
              </span>
            </div>

            <div className="product-price">
              ZES {Number(product.price).toLocaleString()}
            </div>

            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            {product.category && (
              <div className="product-category">
                <strong>Category:</strong> {product.category.name}
              </div>
            )}

            {/* Quantity Selector */}
            {product.status !== 'finished' && (
              <div className="quantity-selector">
                <h3>Quantity</h3>
                <div className="qty-controls">
                  <button 
                    className="qty-btn" 
                    onClick={handleDecreaseQty}
                    disabled={qty <= 1}
                  >
                    <FiTrash2 size={16} />
                  </button>
                  <span className="qty-display">{qty}</span>
                  <button 
                    className="qty-btn" 
                    onClick={handleIncreaseQty}
                    disabled={product.stockCount !== undefined && qty >= product.stockCount}
                  >
                    <FiShoppingCart size={16} />
                  </button>
                </div>
                <p className="stock-info">
                  {product.stockCount !== undefined 
                    ? `Only ${product.stockCount} left in stock` 
                    : 'In stock'}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="product-actions">
              {!user && (
                <div className="guest-order-warning">
                  <p>Please <a href="/login">log in</a> to add items to your cart or save for later.</p>
                </div>
              )}

              {product.status !== 'finished' && (
                <>
                  <button 
                    className="btn btn-outline btn-sm me-2" 
                    onClick={handleAddToCart}
                    disabled={processing}
                     >
                     {processing ? (
                       <><span className="spinner" /> Adding...</>
                      ) : (
                        <>
                          <FiShoppingCart />
                          Add to Cart
                        </>
                      )}
                   </button>
                  
                    <button 
                      className="btn btn-primary btn-sm" 
                      onClick={handleOrderOnWhatsApp}
                      disabled={processing}
                    >
                      {processing ? (
                        <><span className="spinner" /> Sending...</>
                      ) : (
                        <>
                          <FiSend />
                          Order on WhatsApp
                        </>
                      )}
                    </button>
                </>
              )}

              {product.status === 'finished' && (
                <button 
                  className="btn btn-outline btn-sm" 
                  disabled
                >
                  Out of Stock
                </button>
              )}

              {/* Admin buttons (if owner) */}
              {user && product.seller?._id === user._id && (
                <div className="admin-actions mt-3">
                  <Link 
                    to={`/edit-product/${product._id}`} 
                    className="btn btn-ghost btn-sm me-2"
                  >
                    <FiEdit2 /> Edit Product
                  </Link>
                  <button 
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this product?')) {
                        navigate('/my-products')
                        // Note: Actual delete would happen via API call in EditProduct or MyProducts
                      }
                    }}
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              )}
            </div>

            {/* Seller Info */}
            {product.seller && (
              <div className="seller-info">
                <h3>About the Seller</h3>
                <div className="seller-profile">
                  <img 
                    src={product.seller.profilePic || 'https://picsum.photos/seed/avatar1/50/50'} 
                    alt={product.seller.name} 
                  />
                  <div className="seller-details">
                    <h4>{product.seller.name}</h4>
                    <p>{product.seller.username}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashLayout>
  )
}