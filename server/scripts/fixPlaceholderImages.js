const mongoose = require('mongoose')
require('dotenv').config()

const Product = require('../models/Product')
const Category = require('../models/Category')

async function fixImages() {
  if (!process.env.MONGODB_URI) {
    throw new Error('Missing MONGODB_URI')
  }

  await mongoose.connect(process.env.MONGODB_URI)

  // Find all products with via.placeholder.com images
  const products = await Product.find({
    'images.url': /via\.placeholder\.com/
  })

  console.log(`Found ${products.length} products with broken placeholder images`)

  for (const product of products) {
    const category = await Category.findById(product.category)
    const catName = category?.name || 'Unknown'
    const variant = product.title.split(' ').pop() || 'variant'

    const text = encodeURIComponent(`${catName} ${variant}`.slice(0, 30))
    const newUrl = `https://placehold.co/600x450/E91789/white.png?text=${text}`

    product.images = [{
      url: newUrl,
      publicId: `seed-${catName.replace(/\s+/g, '_')}-${variant}`,
    }]

    await product.save()
    console.log(`✓ Updated: ${product.title}`)
  }

  console.log('\nDone! All placeholder images fixed.')
  await mongoose.disconnect()
}

fixImages().catch(err => {
  console.error(err)
  process.exit(1)
})
