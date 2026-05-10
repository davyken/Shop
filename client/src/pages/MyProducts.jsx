import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiPlusCircle, FiEdit2, FiTrash2 } from 'react-icons/fi'
import DashLayout from '../components/DashLayout'
import api from '../api/axios'
import toast from 'react-hot-toast'
import './MyProducts.css'

const STATUS_LABEL = { available: 'Available', finished: 'Finished', in_stock: 'In Stock' }

export default function MyProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)
  const [confirmId, setConfirmId] = useState(null)

  const fetch = async () => {
    try {
      const { data } = await api.get('/api/products/my')
      setProducts(data.products)
    } catch {}
    setLoading(false)
  }

  useEffect(() => { fetch() }, [])

  const handleDelete = async (id) => {
    setDeleting(id)
    try {
      await api.delete(`/api/products/${id}`)
      setProducts(prev => prev.filter(p => p._id !== id))
      toast.success('Product deleted')
    } catch {
      toast.error('Failed to delete')
    }
    setDeleting(null)
    setConfirmId(null)
  }

  return (
    <DashLayout title="My Products">
      <div className="my-products-page">
        <div className="page-header">
          <p className="page-sub">{products.length} product{products.length !== 1 ? 's' : ''} listed</p>
          <Link to="/add-product" className="btn btn-primary"><FiPlusCircle /> Add Product</Link>
        </div>

        {loading ? <p>Loading...</p> : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <p>No products yet.</p>
            <Link to="/add-product" className="btn btn-primary" style={{ marginTop: '1rem' }}>Add Your First Product</Link>
          </div>
        ) : (
          <div className="my-products-table">
            <div className="table-head">
              <span>Product</span>
              <span>Category</span>
              <span>Price</span>
              <span>Status</span>
              <span>Actions</span>
            </div>
            {products.map(p => (
              <div key={p._id} className="table-row">
                <div className="product-info">
                  <img src={p.images?.[0]?.url || 'https://picsum.photos/seed/prod2/50/50'} alt={p.title} />
                  <span>{p.title}</span>
                </div>
                <span className="table-cat">{p.category?.name || '-'}</span>
                <span className="table-price">ZES {Number(p.price).toLocaleString()}</span>
                <span><span className={`badge badge-${p.status}`}>{STATUS_LABEL[p.status]}{p.status === 'in_stock' ? ` (${p.stockCount})` : ''}</span></span>
                <div className="table-actions">
                  <Link to={`/edit-product/${p._id}`} className="btn btn-ghost btn-sm"><FiEdit2 /></Link>
                  {confirmId === p._id ? (
                    <div className="confirm-del">
                      <span>Delete?</span>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)} disabled={deleting === p._id}>
                        {deleting === p._id ? <span className="spinner" style={{ borderTopColor: 'white', width: 14, height: 14 }} /> : 'Yes'}
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => setConfirmId(null)}>No</button>
                    </div>
                  ) : (
                    <button className="btn btn-danger btn-sm" onClick={() => setConfirmId(p._id)}><FiTrash2 /></button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashLayout>
  )
}
