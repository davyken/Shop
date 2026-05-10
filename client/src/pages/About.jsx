import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiUsers, FiSettings, FiTruck, FiShield } from 'react-icons/fi'
import DashLayout from '../components/DashLayout'
import './About.css'

export default function About() {
  return (
    <DashLayout title="About Us">
      <div className="about-page">
        <div className="about-content">
          <h1>About Blessing Babyshop</h1>
          
          <div className="about-story">
            <h2>Our Story</h2>
            <p>
              Blessing Babyshop was founded in 2023 with a simple mission: to provide 
              high-quality, affordable baby products to families across Cameroon. 
              We understand the joy and challenges of parenthood, and we're here to 
              make your journey a little easier.
            </p>
          </div>

          <div className="about-values">
            <h2>Our Values</h2>
            <div className="values-grid">
            <div className="value-card">
              <FiUsers />
              <h3>Community Focused</h3>
              <p>We believe in building a community where parents can share, 
                 support, and grow together.</p>
            </div>
            <div className="value-card">
              <FiSettings />
              <h3>Quality & Safety</h3>
              <p>Every product in our shop meets strict quality and safety 
                 standards to protect your little ones.</p>
            </div>
            <div className="value-card">
              <FiTruck />
              <h3>Fast & Reliable</h3>
              <p>We strive for quick processing and reliable delivery 
                 to get your orders to you on time.</p>
            </div>
            <div className="value-card">
              <FiShield />
              <h3>Trust & Transparency</h3>
              <p>We operate with full transparency, ensuring you know 
                 exactly what you're getting and from whom.</p>
            </div>
            </div>
          </div>

          <div className="about-mission">
            <h2>Our Mission</h2>
            <p>
              To empower Cameroonian families by providing access to affordable, 
              quality baby products through a trusted online marketplace that 
              connects buyers and sellers seamlessly.
            </p>
          </div>
        </div>
      </div>
    </DashLayout>
  )
}