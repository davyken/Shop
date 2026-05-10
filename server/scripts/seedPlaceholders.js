const mongoose = require('mongoose')
require('dotenv').config()

const Category = require('../models/Category')
const Product = require('../models/Product')
const User = require('../models/User')

const MONGODB_URI = process.env.MONGODB_URI

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function makePlaceholderImage(text, variant) {
  const label = `${text} ${variant}`.slice(0, 30)
  return {
    url: `https://placehold.co/600x450/E91789/white.png?text=${encodeURIComponent(label)}`,
    publicId: `placeholder-${text.replace(/\s+/g, '_')}-${variant}`,
  }
}

async function ensureSeller() {
  const existing = await User.findOne({ role: { $in: ['seller', 'both'] } }).limit(1)
  if (existing) return existing

  const demo = await User.create({
    username: 'demoSeller',
    name: 'Demo Seller',
    email: 'demoSeller@example.com',
    password: 'password123',
    role: 'seller',
  })
  return demo
}

async function main() {
  if (!MONGODB_URI) {
    throw new Error('Missing MONGODB_URI in environment')
  }

  await mongoose.connect(MONGODB_URI)

  console.log('Deleting all products...')
  await Product.deleteMany({})
  console.log('✓ Deleted')

  const categories = await Category.find({})
  const seller = await ensureSeller()

  const productNamesByCategory = {
    'Diapers & Wipes': ['Premium Diapers', 'Sensitive Wipes', 'Ultra-Soft Wipes', 'Eco Diapers'],
    'Baby Skincare': ['Gentle Baby Lotion', 'Soothing Cream', 'Baby Oil', 'Barrier Ointment'],
    'Feeding Bottles': ['Feeding Bottle 250ml', 'Anti-Colic Bottle', 'Slow Flow Teat', 'Bottle Brush'],
    'Breastfeeding Supplies': ['Nursing Pads', 'Breast Milk Storage Bags', 'Breast Pump Manual', 'Lanolin Cream'],
    'Baby Clothing': ['Cotton Onesie', 'Sleepwear Set', 'Everyday Romper', 'Comfort Hoodie'],
    'Baby Shoes & Socks': ['Newborn Socks', 'Soft Booties', 'Non-Slip Socks', 'Baby Shoes'],
    'Toys & Games': ['Teething Toy', 'Baby Rattle', 'Stacking Blocks', 'Learning Cards'],
    'Bath & Potty': ['Bath Thermometer', 'Baby Wash', 'Baby Shampoo', 'Potty Training Kit'],
    'Strollers & Car Seats': ['Lightweight Stroller', 'Baby Car Seat', 'Stroller Organizer', 'Car Seat Cover'],
    'Baby Bedding': ['Cotton Bed Sheet', 'Fitted Crib Sheet', 'Baby Blanket', 'Breathable Swaddle'],
    'Teethers & Pacifiers': ['Silicone Teether', 'Pacifier Set', 'Teething Gel', 'Soothing Dummy'],
    'Diaper Bags': ['Large Diaper Bag', 'Organizer Inserts', 'Wipes Compartment Bag', 'Travel Diaper Tote'],
    'Swaddles & Blankets': ['Muslin Swaddle', 'Warm Blanket', 'Lightweight Swaddle', 'Seasonal Cover'],
    'Baby Health': ['Digital Thermometer', 'Nasal Aspirator', 'Baby First Aid Kit', 'Vitamin Drops'],
    'Nursery Furniture': ['Changing Table', 'Baby Rocking Chair', 'Nursery Organizer', 'Crib Mattress'],
    'Newborn Essentials': ['Newborn Starter Pack', 'Hospital Bag Kit', 'Newborn Hat Set', 'Baby Care Kit'],
    'Learning & Education': ['Baby Activity Book', 'Color Flash Cards', 'Toy Piano', 'Shapes Blocks'],
    'Travel Essentials': ['Carrying Sling', 'Travel Changing Mat', 'Stroller Fan', 'Travel Bottle Warmer'],
    'Hair & Grooming': ['Baby Hair Brush', 'Gentle Shampoo Comb', 'Detangling Spray', 'Nail Clippers'],
    'Seasonal Outfits': ['Rainy Season Outfit', 'Summer Romper', 'Holiday Set', 'Winter Warm Set'],
  }

  const productsToCreate = []

  for (const cat of categories) {
    const catName = cat.name
    const options = productNamesByCategory[catName] || ['Baby Item']

    for (let i = 0; i < 3; i++) {
      const base = pick(options)
      const variant = `#${i + 1}`
      const title = `${base} ${variant} (${catName})`
      const price = randInt(1500, 22000)
      const stockCount = randInt(5, 50)

      // Use placehold.co - guaranteed to load
      const img = makePlaceholderImage(base.slice(0, 15), variant)

      productsToCreate.push({
        title,
        description: `High quality ${base.toLowerCase()} designed for baby comfort and safety. Perfect for ${catName.toLowerCase()}.`,
        price,
        category: cat._id,
        status: 'available',
        stockCount,
        images: [{ url: img.url, publicId: img.publicId }],
        seller: seller._id,
      })
    }
  }

  console.log(`Seeding ${productsToCreate.length} products...`)

  for (const p of productsToCreate) {
    await Product.create({
      ...p,
      images: p.images.map(img => ({ url: img.url, publicId: img.publicId })),
    })
  }

  console.log('✓ Seeded', productsToCreate.length, 'products')
  const samples = await Product.find({ isDeleted: false }).limit(3)
  samples.forEach((p, i) => {
    console.log(`${i+1}. ${p.title} -> ${p.images[0]?.url}`)
  })

  await mongoose.disconnect()
}

main().catch(async (err) => {
  console.error(err)
  await mongoose.disconnect()
  process.exit(1)
})
