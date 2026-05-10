import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiPlusCircle, FiShoppingCart, FiSearch } from 'react-icons/fi'
import api from '../api/axios'
import ProductCard from '../components/ProductCard'
import { useAuth } from '../context/AuthContext'
import LoginModal from '../components/LoginModal'
import RegisterModal from '../components/RegisterModal'
import './Landing.css'


const features = [
  { icon: '👶', title: 'Baby Essentials', desc: 'Everything your little one needs, from clothing to toys.' },
  { icon: '🛍️', title: 'Buy & Sell', desc: 'List your pre-loved baby items or find great deals.' },
  { icon: '🔒', title: 'Safe & Trusted', desc: 'Verified sellers and secure checkout every time.' },
  { icon: '🚀', title: 'Fast Delivery', desc: 'Get your items delivered quickly across Cameroon.' },
]






export default function Landing() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [categories, setCategories] = useState([])
  const [popular, setPopular] = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const [topDeals, setTopDeals] = useState([])
  const [loading, setLoading] = useState(true)

  const [loginOpen, setLoginOpen] = useState(false)
  const [registerOpen, setRegisterOpen] = useState(false)

  const sectionsLoading = loading

  const heroSections = useMemo(() => {
    return [
      { title: 'Top Picks', data: popular },
      { title: 'New Arrivals', data: newArrivals },
      { title: 'Best Value Deals', data: topDeals },
    ]
  }, [popular, newArrivals, topDeals])

  useEffect(() => {
    let mounted = true
    const fetchAll = async () => {
      try {
        const [catsRes, popRes, newRes, dealRes] = await Promise.all([
          api.get('/api/categories'),
          api.get('/api/products?page=1&limit=12'),
          api.get('/api/products?page=2&limit=12'),
          api.get('/api/products?page=1&limit=12&maxPrice=12000'),
        ])

        if (!mounted) return
        setCategories(catsRes.data.categories || [])
        setPopular(popRes.data.products || [])
        setNewArrivals(newRes.data.products || [])
        setTopDeals(dealRes.data.products || [])
      } catch {
        // ignore
      }
      if (mounted) setLoading(false)
    }
    fetchAll()
    return () => {
      mounted = false
    }
  }, [])

  const handleCreateListing = () => {
    if (user) return navigate('/add-product')
    setLoginOpen(true)
  }

  return (
    <div className="landing">

      {/* Hero */}
      <section className="hero">
        <div className="hero-bg-blobs">
          <div className="blob blob1" />
          <div className="blob blob2" />
          <div className="blob blob3" />
        </div>
        <div className="hero-content">
          <div className="hero-badge">🌟 Cameroon's #1 Baby Marketplace</div>
          <h1 className="hero-title">
            Everything Your<br />
            <span className="hero-accent">Little Blessing</span><br />
            Needs
          </h1>
          <p className="hero-sub">
            Buy and sell quality baby products — from newborn essentials to toddler gear.
            Join thousands of parents across Cameroon.
          </p>
          <div className="hero-cta">
            <Link to="/register" className="btn btn-primary btn-lg">Get Started Free 🍼</Link>
            <Link to="/login" className="btn btn-outline btn-lg">Sign In</Link>
          </div>

          <div className="hero-cta-2">
            <button className="btn btn-ghost btn-lg" onClick={handleCreateListing}>
              <FiPlusCircle /> Create a listing
            </button>
          </div>

          <div className="hero-stats">
            <div><strong>2,500+</strong><span>Products</span></div>
            <div><strong>1,200+</strong><span>Happy Parents</span></div>
            <div><strong>4.9★</strong><span>Rating</span></div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-logo-wrap">
            <div className="hero-heart">
              <div className="big-footprints">
                <span className="foot foot-pink">👣</span>
                <span className="foot foot-blue">👣</span>
              </div>
            </div>
            <div className="floating-bubbles">
              {['🧸','🍼','👗','🚗','🛁','🧴'].map((e,i) => (
                <span key={i} className={`bubble b${i+1}`}>{e}</span>
              ))}
            </div>
          </div>
        </div>
      </section>



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
                navigate(`/shop?category=${c._id}`)
              }}
            >
              {c.name}
            </a>
          ))}
        </div>
      </section>

      {/* Product sections (Amazon-style rows) */}
      <section className="product-sections">
        <div className="section-inner">
          {sectionsLoading ? (
            <div className="loading-grid">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="skeleton-card" />
              ))}
            </div>
          ) : (
            heroSections.map((s) => (
              <div key={s.title} className="product-row-section">
                <div className="product-row-head">
                  <h2 className="row-title">{s.title}</h2>
                  <Link className="row-view-all" to="/shop">
                    View all
                  </Link>
                </div>
                <div className="product-row-grid">
                  {s.data.slice(0, 12).map((p) => (
                    <ProductCard key={p._id} product={p} />
                  ))}
                </div>
              </div>
            ))
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
