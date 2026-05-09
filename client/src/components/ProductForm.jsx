import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiUpload, FiX, FiPlusCircle } from 'react-icons/fi'
import DashLayout from '../components/DashLayout'
import api from '../api/axios'
import toast from 'react-hot-toast'
import './ProductForm.css'

export default function ProductForm({ product, isEdit }) {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [newCategory, setNewCategory] = useState('')
  const [previews, setPreviews] = useState([])
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    title: product?.title || '',
    description: product?.description || '',
    price: product?.price || '',
    category: product?.category?._id || product?.category || '',
    status: product?.status || 'available',
    stockCount: product?.stockCount || 0,
  })

  useEffect(() => {
    api.get('/api/categories').then(({ data }) => setCategories(data.categories))
    if (product?.images) {
      setPreviews(product.images.map(img => ({ url: img.url, publicId: img.publicId, existing: true })))
    }
  }, [])

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleImages = (e) => {
    const newFiles = Array.from(e.target.files)
    setFiles(prev => [...prev, ...newFiles])
    newFiles.forEach(f => {
      const reader = new FileReader()
      reader.onload = (ev) => setPreviews(prev => [...prev, { url: ev.target.result, existing: false }])
      reader.readAsDataURL(f)
    })
  }

  const removePreview = (i) => {
    setPreviews(prev => prev.filter((_, idx) => idx !== i))
    if (!previews[i].existing) {
      setFiles(prev => {
        const existingCount = previews.filter((_, idx) => idx < i && !previews[idx].existing).length
        return prev.filter((_, idx) => idx !== existingCount)
      })
    }
  }

  const addCategory = async () => {
    if (!newCategory.trim()) return
    try {
      const { data } = await api.post('/api/categories', { name: newCategory.trim() })
      setCategories(prev => [...prev, data.category])
      setForm(f => ({ ...f, category: data.category._id }))
      setNewCategory('')
      toast.success('Category added!')
    } catch {
      toast.error('Failed to add category')
    }
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!form.category) return toast.error('Please select a category')
    setLoading(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      files.forEach(f => fd.append('images', f))
      const removedPublicIds = previews.filter(p => p.existing === false && !p.url.startsWith('http')).map(p => p.publicId).filter(Boolean)
      if (removedPublicIds.length) fd.append('removeImages', JSON.stringify(removedPublicIds))

      if (isEdit) {
        await api.put(`/api/products/${product._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        toast.success('Product updated!')
      } else {
        await api.post('/api/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        toast.success('Product added!')
      }
      navigate('/my-products')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product')
    }
    setLoading(false)
  }

  return (
    <DashLayout title={isEdit ? 'Edit Product' : 'Add Product'}>
      <div className="product-form-page">
        <form onSubmit={submit} className="product-form-wrap">
          {/* Left column */}
          <div className="pf-left">
            <div className="card">
              <h3 className="pf-section-title">Product Images</h3>
              <div className="image-upload-area" onClick={() => document.getElementById('imgInput').click()}>
                <FiUpload className="upload-icon" />
                <p>Click to upload images</p>
                <p className="upload-hint">JPG, PNG, WEBP — Max 5 images</p>
              </div>
              <input id="imgInput" type="file" accept="image/*" multiple hidden onChange={handleImages} />
              {previews.length > 0 && (
                <div className="image-previews">
                  {previews.map((p, i) => (
                    <div key={i} className="preview-item">
                      <img src={p.url} alt="" />
                      <button type="button" className="remove-img" onClick={() => removePreview(i)}><FiX /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right column */}
          <div className="pf-right">
            <div className="card">
              <h3 className="pf-section-title">Product Info</h3>
              <div className="form-group">
                <label className="form-label">Product Title *</label>
                <input name="title" className="form-input" value={form.title} onChange={handle} placeholder="e.g. Baby Romper Set" required />
              </div>
              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea name="description" className="form-textarea" value={form.description} onChange={handle} placeholder="Describe the product..." required />
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Price (XAF) *</label>
                  <input name="price" type="number" min="0" className="form-input" value={form.price} onChange={handle} placeholder="e.g. 5000" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock Count</label>
                  <input name="stockCount" type="number" min="0" className="form-input" value={form.stockCount} onChange={handle} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select name="category" className="form-select" value={form.category} onChange={handle}>
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Or Add New Category</label>
                <div className="new-cat-wrap">
                  <input className="form-input" value={newCategory} onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="New category name" onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())} />
                  <button type="button" className="btn btn-secondary btn-sm" onClick={addCategory}><FiPlusCircle /></button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Status *</label>
                <div className="status-options">
                  {[['available','✅ Available'],['in_stock','📦 In Stock'],['finished','❌ Finished']].map(([val, label]) => (
                    <label key={val} className={`status-opt ${form.status === val ? 'selected' : ''}`}>
                      <input type="radio" name="status" value={val} checked={form.status === val} onChange={handle} hidden />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                {loading ? <span className="spinner" /> : isEdit ? '💾 Save Changes' : '🚀 Publish Product'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </DashLayout>
  )
}
