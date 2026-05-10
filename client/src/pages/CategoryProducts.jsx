import { useEffect, useState, useCallback } from 'react'
import { FiFilter, FiX } from 'react-icons/fi'
import DashLayout from '../components/DashLayout'
import ProductCard from '../components/ProductCard'
import api from '../api/axios'
import { useParams } from 'react-router-dom'

export default function CategoryProducts() {
  const { id } = useParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showFilters, setShowFilters] = useState(false)

  const [filters, setFilters] = useState({
    search: '', category: id, status: '', minPrice: '', maxPrice: ''
  })

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
      setProducts(data.products)
      setTotal(data.total)
      setTotalPages(data.pages)
    } catch {}
    setLoading(false)
  }, [filters, page])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const clearFilters = () => {
    setFilters({ search: '', category: id, status: '', minPrice: '', maxPrice: '' })
    setPage(1)
  }

  const hasFilters = Object.values(filters).some(Boolean)

  return (
    <DashLayout title="Category Products">
      <div className="category-products-page">
        {/* Search bar */}
        <div className="shop-toolbar">
          <div className="search-wrap">
            <FiFilter className="search-icon" />
            <input
              className="search-input"
              placeholder="Search in category..."
              value={filters.search}
              onChange={(e) => { setFilters({ ...filters, search: e.target.value }); setPage(1) }}
            />
          </div>
          <button className={`btn btn-ghost filter-toggle ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}>
            Filters {hasFilters && <span className="filter-dot" />}
          </button>
          {hasFilters && <button className="btn btn-ghost btn-sm" onClick={clearFilters}><FiX /> Clear</button>}
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="filter-panel">
            <div className="filter-group">
              <label>Status</label>
              <select className="form-select" value={filters.status}
                onChange={(e) => { setFilters({ ...filters, status: e.target.value }); setPage(1) }}>
                <option value="">All Statuses</option>
                <option value="available">Available</option>
                <option value="in_stock">In Stock</option>
                <option value="finished">Finished</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Min Price (ZES)</label>
              <input type="number" className="form-input" value={filters.minPrice}
                onChange={(e) => { setFilters({ ...filters, minPrice: e.target.value }); setPage(1) }}
                placeholder="0" />
            </div>
            <div className="filter-group">
              <label>Max Price (ZES)</label>
              <input type="number" className="form-input" value={filters.maxPrice}
                onChange={(e) => { setFilters({ ...filters, maxPrice: e.target.value }); setPage(1) }}
                placeholder="No limit" />
            </div>
          </div>
        )}

        <p className="result-count">{total} product{total !== 1 ? 's' : ''} found</p>

        {loading ? (
          <div className="loading-grid">
            {[...Array(8)].map((_, i) => <div key={i} className="skeleton-card" />)}
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <p>No products found in this category.</p>
          </div>
        ) : (
          <div className="product-grid">{products.map(p => <ProductCard key={p._id} product={p} />)}</div>
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
    </DashLayout>
  )
}