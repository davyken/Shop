import { useState } from 'react'
import { FiSend } from 'react-icons/fi'
import './StickyWhatsAppButton.css'

const WHATSAPP_PHONE = '237XXXXXXXXX' // Replace with actual number

export default function StickyWhatsAppButton({ productName }) {
  const [clicked, setClicked] = useState(false)

  const handleClick = () => {
    if (!productName) return
    
    const message = `Hello, I want to order ${productName}`
    window.open(
      `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`,
      '_blank'
    )
    
    setClicked(true)
    setTimeout(() => setClicked(false), 2000) // Reset after 2 seconds
  }

  return (
    <div className={`sticky-whatsapp-btn ${clicked ? 'clicked' : ''}`} onClick={handleClick}>
      <FiSend />
      <span>Order on WhatsApp</span>
    </div>
  )
}