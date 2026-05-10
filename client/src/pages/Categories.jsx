import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiGrid, FiMessageSquare } from 'react-icons/fi'
import DashLayout from '../components/DashLayout'
import api from '../api/axios'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/api/categories')
        setCategories(data.categories || [])
      } catch (err) {
        console.error('Failed to fetch categories:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <DashLayout title="Categories">
        <div className="loading-page">
          <p>Loading categories...</p>
        </div>
      </DashLayout>
    )
  }

  return (
    <DashLayout title="Categories">
      <div className="categories-page">
        <h1>Browse by Category</h1>
        <p className="categories-subtitle">
          Explore our baby products organized by category
        </p>

        {categories.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📂</div>
            <p>No categories available yet.</p>
          </div>
        ) : (
          <div className="categories-grid">
            {categories.map(category => (
              <Link key={category._id} to={`/category/${category._id}`} className="category-card">
                <div className="category-icon">
                  <FiGrid />
                </div>
                <div className="category-info">
                  <h3>{category.name}</h3>
                  <p>Explore products in this category</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Optional: Show some featured products from each category */}
        <div className="featured-section">
          <h2>Featured Categories</h2>
          <div className="featured-categories">
            {categories.slice(0, 3).map(category => (
              <Link key={category._id} to={`/category/${category._id}`} className="featured-category-card">
                <img 
                  src="https://picsum.photos/seed/cat1/300/200" 
                  alt={category.name} 
                />
                <div className="featured-category-overlay">
                  <h3>{category.name}</h3>
                  <p>Shop now</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </DashLayout>
  )
}