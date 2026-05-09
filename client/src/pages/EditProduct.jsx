import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import ProductForm from '../components/ProductForm'
import DashLayout from '../components/DashLayout'

export default function EditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/api/products/${id}`)
      .then(({ data }) => setProduct(data.product))
      .catch(() => navigate('/my-products'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <DashLayout title="Edit Product"><p>Loading...</p></DashLayout>
  return <ProductForm product={product} isEdit />
}
