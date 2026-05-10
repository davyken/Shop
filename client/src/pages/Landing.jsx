import { useEffect, useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiPlusCircle, FiSearch, FiFilter, FiX, FiShoppingCart } from 'react-icons/fi'
import api from '../api/axios'
import ProductCard from '../components/ProductCard'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import LoginModal from '../components/LoginModal'
import RegisterModal from '../components/RegisterModal'
import toast from 'react-hot-toast'
import './Landing.css'


const features = [
  { icon: '👶', title: 'Baby Essentials', desc: 'Everything your little one needs, from clothing to toys.' },
  { icon: '🛍️', title: 'Buy & Sell', desc: 'List your pre-loved baby items or find great deals.' },
  { icon: '🔒', title: 'Safe & Trusted', desc: 'Verified sellers and secure checkout every time.' },
  { icon: '🚀', title: 'Fast Delivery', desc: 'Get your items delivered quickly across Cameroon.' },
]






export default function Landing() {
  const { user } = useAuth()
  const { addItem } = useCart()
  const navigate = useNavigate()

  const [categories, setCategories] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [carouselProducts, setCarouselProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [carouselIndex, setCarouselIndex] = useState(0)

  const [filters, setFilters] = useState({
    search: '', category: '', status: '', minPrice: '', maxPrice: ''
  })

  const [loginOpen, setLoginOpen] = useState(false)
  const [registerOpen, setRegisterOpen] = useState(false)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page, limit: 12 })
      if (filters.search) params.set('search', filters.search)
      if (filters.category) params.set('category', filters.category)
      if (filters.status) params.set('status', filters.status)
      if (filters.minPrice) params.set('minPrice', filters.minPrice)
      if (filters.maxPrice) params.set('maxPrice', filters.maxPrice)
      const { data } = await api.get(`/api/products?${params}`)
      setAllProducts(data.products)
      setTotalPages(data.pages)
    } catch {}
    setLoading(false)
  }, [filters, page])

  useEffect(() => {
    let mounted = true
    const fetchAll = async () => {
      try {
        const [catsRes, prodRes] = await Promise.all([
          api.get('/api/categories'),
          api.get('/api/products?limit=50'),
        ])
        if (!mounted) return
        setCategories(catsRes.data.categories || [])
        setAllProducts(prodRes.data.products || [])
        setCarouselProducts(prodRes.data.products?.slice(0, 6) || [])
      } catch {}
      if (mounted) setLoading(false)
    }
    fetchAll()
    return () => { mounted = false }
  }, [])

  // Carousel auto-advance
  useEffect(() => {
    if (carouselProducts.length <= 1) return
    const id = setInterval(() => {
      setCarouselIndex(i => (i + 1) % carouselProducts.length)
    }, 4000)
    return () => clearInterval(id)
  }, [carouselProducts.length])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const clearFilters = () => {
    setFilters({ search: '', category: '', status: '', minPrice: '', maxPrice: '' })
    setPage(1)
  }

  const handleAddToCart = (product) => {
    if (product.status === 'finished') return toast.error('This product is out of stock')
    addItem(product)
    toast.success('Added to cart! 🛒')
  }

  const hasFilters = Object.values(filters).some(Boolean)

  const handleCreateListing = () => {
    if (user) return navigate('/add-product')
    setLoginOpen(true)
  }

  return (
    <div className="landing">

      {/* Categories strip */}
      <section className="categories-strip">
        <div className="strip-inner">
          {categories.map((c) => (
            <a
              key={c._id}
              href="#"
              className="cat-chip"
              onClick={(e) => {
                e.preventDefault()
                setFilters(f => ({ ...f, category: f.category === c._id ? '' : c._id }))
                setPage(1)
              }}
            >
              {c.name}
            </a>
          ))}
        </div>
      </section>

      {/* Featured Carousel */}
      {carouselProducts.length > 0 && (
        <section className="featured-carousel">
          <div className="carousel-inner">
            <div className="carousel-track" style={{ transform: `translateX(-${carouselIndex * 100}%)` }}>
              {carouselProducts.map((product) => (
                <div className="carousel-slide" key={product._id}>
                  <div className="carousel-card">
                    <img src={product.images?.[0]?.url || 'https://picsum.photos/seed/land1/400/300'} alt={product.title} className="carousel-img" />
                    <div className="carousel-info">
                      <p className="carousel-category">{product.category?.name || 'Baby Product'}</p>
                      <h3 className="carousel-title">{product.title}</h3>
                      <p className="carousel-price">ZES {Number(product.price).toLocaleString()}</p>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleAddToCart(product)}
                        disabled={product.status === 'finished'}
                      >
                        <FiShoppingCart /> Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel controls */}
            <button className="carousel-btn carousel-prev" onClick={() => setCarouselIndex(i => (i - 1 + carouselProducts.length) % carouselProducts.length)}>
              ‹
            </button>
            <button className="carousel-btn carousel-next" onClick={() => setCarouselIndex(i => (i + 1) % carouselProducts.length)}>
              ›
            </button>
          </div>

          {/* Dots */}
          <div className="carousel-dots">
            {carouselProducts.map((_, idx) => (
              <button
                key={idx}
                className={`carousel-dot ${idx === carouselIndex ? 'active' : ''}`}
                onClick={() => setCarouselIndex(idx)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Products section with search & filter */}
      <section className="product-sections">
        <div className="section-inner">
          {/* Search & Filter toolbar */}
          <div className="shop-toolbar">
            <div className="search-wrap">
              <FiSearch className="search-icon" />
              <input
                className="search-input"
                placeholder="Search baby products..."
                value={filters.search}
                onChange={(e) => { setFilters(f => ({ ...f, search: e.target.value })); setPage(1) }}
              />
            </div>
            <button className={`btn btn-ghost filter-toggle ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}>
              <FiFilter /> Filters {hasFilters && <span className="filter-dot" />}
            </button>
            {hasFilters && <button className="btn btn-ghost btn-sm" onClick={clearFilters}><FiX /> Clear</button>}
          </div>

          {/* Filter panel */}
          {showFilters && (
            <div className="filter-panel">
              <div className="filter-group">
                <label>Category</label>
                <select className="form-select" value={filters.category}
                  onChange={(e) => { setFilters(f => ({ ...f, category: e.target.value })); setPage(1) }}>
                  <option value="">All Categories</option>
                  {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div className="filter-group">
                <label>Status</label>
                <select className="form-select" value={filters.status}
                  onChange={(e) => { setFilters(f => ({ ...f, status: e.target.value })); setPage(1) }}>
                  <option value="">All Statuses</option>
                  <option value="available">Available</option>
                  <option value="in_stock">In Stock</option>
                  <option value="finished">Finished</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Min Price (ZES)</label>
                <input type="number" className="form-input" value={filters.minPrice}
                  onChange={(e) => { setFilters(f => ({ ...f, minPrice: e.target.value })); setPage(1) }}
                  placeholder="0" />
              </div>
              <div className="filter-group">
                <label>Max Price (ZES)</label>
                <input type="number" className="form-input" value={filters.maxPrice}
                  onChange={(e) => { setFilters(f => ({ ...f, maxPrice: e.target.value })); setPage(1) }}
                  placeholder="No limit" />
              </div>
            </div>
          )}

          <p className="result-count">{allProducts.length} product{allProducts.length !== 1 ? 's' : ''} found</p>

          {loading ? (
            <div className="loading-grid">
              {[...Array(8)].map((_, i) => <div key={i} className="skeleton-card" />)}
            </div>
          ) : allProducts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <p>No products found. Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="product-row-grid">
              {allProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button className="btn btn-ghost btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
              <span>Page {page} of {totalPages}</span>
              <button className="btn btn-ghost btn-sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="section-inner">
          <h2 className="section-title">Why Blessing Babyshop?</h2>
          <p className="section-sub">A marketplace built with love for Cameroonian families</p>
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className="feature-card">
                <span className="feature-icon">{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-inner">
          <h2>Ready to Join?</h2>
          <p>Register today and start buying or selling baby products in minutes.</p>
          <Link to="/register" className="btn btn-primary btn-lg">Create Free Account</Link>
        </div>
      </section>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
      <RegisterModal open={registerOpen} onClose={() => setRegisterOpen(false)} />

      {/* Footer */}
      <footer className="landing-footer">

        <p>🍼 <strong>Blessing Babyshop</strong> — Made with ❤️ for families in Cameroon</p>
        <p>© {new Date().getFullYear()} All rights reserved.</p>
      </footer>
    </div>
  )
}
