import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import './Landing.css'

const features = [
  { icon: '👶', title: 'Baby Essentials', desc: 'Everything your little one needs, from clothing to toys.' },
  { icon: '🛍️', title: 'Buy & Sell', desc: 'List your pre-loved baby items or find great deals.' },
  { icon: '🔒', title: 'Safe & Trusted', desc: 'Verified sellers and secure checkout every time.' },
  { icon: '🚀', title: 'Fast Delivery', desc: 'Get your items delivered quickly across Cameroon.' },
]






export default function Landing() {


  return (
    <div className="landing">
      <Navbar />
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

      {/* Footer */}
      <footer className="landing-footer">
        <p>🍼 <strong>Blessing Babyshop</strong> — Made with ❤️ for families in Cameroon</p>
        <p>© {new Date().getFullYear()} All rights reserved.</p>
      </footer>
    </div>
  )
}
