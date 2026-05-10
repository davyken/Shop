import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi'
import DashLayout from '../components/DashLayout'
import './Contact.css'

export default function Contact() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormState(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formState.name || !formState.email || !formState.message) {
      toast.error('Please fill in all required fields')
      return
    }

    setSubmitting(true)
    // In a real app, you would send this data to your backend API
    // For now, we'll simulate a successful submission
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSubmitSuccess(true)
      setFormState({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitSuccess) {
    return (
      <DashLayout title="Contact Us">
        <div className="contact-page">
          <div className="contact-success">
            <FiSend className="success-icon" />
            <h2>Message Sent!</h2>
            <p>Thank you for contacting Blessing Babyshop. We'll get back to you shortly.</p>
            <Link to="/contact" className="btn btn-primary">
              Send Another Message
            </Link>
          </div>
        </div>
      </DashLayout>
    )
  }

  return (
    <DashLayout title="Contact Us">
      <div className="contact-page">
        <div className="contact-content">
          <h1>Get In Touch</h1>
          <p className="contact-subtitle">
            Have questions? We're here to help! Reach out to us via any of the methods below.
          </p>

          <div className="contact-info">
            <div className="info-item">
              <FiPhone className="info-icon" />
              <div>
                <h3>Call Us</h3>
                <p>+237 XXXXXXXXX</p>
                <p>Available: Mon-Sat, 8am-6pm</p>
              </div>
            </div>
            <div className="info-item">
              <FiMail className="info-icon" />
              <div>
                <h3>Email Us</h3>
                <p>info@blessingbabyshop.cm</p>
                <p>We respond within 24 hours</p>
              </div>
            </div>
            <div className="info-item">
              <FiMapPin className="info-icon" />
              <div>
                <h3>Visit Us</h3>
                <p>Douala, Cameroon</p>
                <p>(Exact address available upon request)</p>
              </div>
            </div>
          </div>

          <div className="contact-form-section">
            <h2>Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formState.subject}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  rows="5"
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={submitting}
              >
                {submitting ? (
                  <><span className="spinner" /> Sending...</>
                ) : (
                  <><FiSend /> Send Message</>
                )}
              </button>
            </form>
          </div>

          {/* WhatsApp direct link */}
          <div className="whatsapp-contact">
            <h2>Or Chat With Us On WhatsApp</h2>
            <p>
              For quick responses, you can also contact us directly on WhatsApp:
            </p>
            <a
              href="https://wa.me/237XXXXXXXXX"
              className="btn btn-whatsapp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FiPhone className="whatsapp-icon" /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </DashLayout>
  )
}