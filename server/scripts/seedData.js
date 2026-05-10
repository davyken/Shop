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

function makeImage(seed, variant) {
  // Using reliable placeholder service - placehold.co
  const text = encodeURIComponent(`${seed} ${variant}`.slice(0, 30))
  return {
    url: `https://placehold.co/600x450/E91789/white.png?text=${text}`,
    publicId: `seed-${seed.replace(/\s+/g, '_')}-${variant}`,
  }
}

async function ensureSeller() {
  // try to find an existing seller user, otherwise create a demo seller
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

  // 20 categories
  const categories = [
    'Diapers & Wipes',
    'Baby Skincare',
    'Feeding Bottles',
    'Breastfeeding Supplies',
    'Baby Clothing',
    'Baby Shoes & Socks',
    'Toys & Games',
    'Bath & Potty',
    'Strollers & Car Seats',
    'Baby Bedding',
    'Teethers & Pacifiers',
    'Diaper Bags',
    'Swaddles & Blankets',
    'Baby Health',
    'Nursery Furniture',
    'Newborn Essentials',
    'Learning & Education',
    'Travel Essentials',
    'Hair & Grooming',
    'Seasonal Outfits',
  ]

  const createdCategories = []
  for (const name of categories) {
    const doc = await Category.findOne({ name: { $regex: `^${name}$`, $options: 'i' } })
    if (doc) {
      createdCategories.push(doc)
    } else {
      const c = await Category.create({ name, isSystem: true })
      createdCategories.push(c)
    }
  }

  const seller = await ensureSeller()

  // Generate at least 20 products across the 20 categories (we'll do ~60 for nicer browsing)
  const productTemplates = [
    { status: 'available', stockMin: 5, stockMax: 60 },
    { status: 'in_stock', stockMin: 1, stockMax: 40 },
    { status: 'available', stockMin: 10, stockMax: 80 },
    { status: 'in_stock', stockMin: 3, stockMax: 25 },
  ]

  const productNamesByCategory = {
    'Diapers & Wipes': ['Premium Diapers', 'Sensitive Wipes', 'Ultra-Soft Wipes', 'Eco Diapers'],
    'Baby Skincare': ['Gentle Baby Lotion', 'Soothing Cream', 'Baby Oil', 'Barrier Ointment'],
    'Feeding Bottles': ['Feeding Bottle 250ml', 'Anti-Colic Bottle', 'Slow Flow Teat', 'Bottle Brush'],
    'Breastfeeding Supplies': ['Nursing Pads', 'Breast Milk Storage Bags', 'Breast Pump (Manual)', 'Lanolin Cream'],
    'Baby Clothing': ['Cotton Onesie', 'Sleepwear Set', 'Everyday Romper', 'Comfort Hoodie'],
    'Baby Shoes & Socks': ['Newborn Socks', 'Soft Booties', 'Non-Slip Socks', 'Baby Shoes'],
    'Toys & Games': ['Teething Toy', 'Baby Rattle', 'Stacking Blocks', 'Learning Cards'],
    'Bath & Potty': ['Bath Thermometer', 'Baby Wash', 'Baby Shampoo', 'Potty Training Kit'],
    'Strollers & Car Seats': ['Lightweight Stroller', 'Baby Car Seat', 'Stroller Organizer', 'Car Seat Cover'],
    'Baby Bedding': ['Cotton Bed Sheet', 'Fitted Crib Sheet', 'Baby Blanket', 'Breathable Swaddle'],
    'Teethers & Pacifiers': ['Silicone Teether', 'Pacifier Set', 'Teething Gel (Demo)', 'Soothing Dummy'],
    'Diaper Bags': ['Large Diaper Bag', 'Organizer Inserts', 'Wipes Compartment Bag', 'Travel Diaper Tote'],
    'Swaddles & Blankets': ['Muslin Swaddle', 'Warm Blanket', 'Lightweight Swaddle', 'Seasonal Cover'],
    'Baby Health': ['Digital Thermometer', 'Nasal Aspirator', 'Baby First Aid Kit', 'Vitamin Drops (Demo)'],
    'Nursery Furniture': ['Changing Table', 'Baby Rocking Chair', 'Nursery Organizer', 'Crib Mattress'],
    'Newborn Essentials': ['Newborn Starter Pack', 'Hospital Bag Kit', 'Newborn Hat Set', 'Baby Care Kit'],
    'Learning & Education': ['Baby Activity Book', 'Color Flash Cards', 'Toy Piano', 'Shapes Blocks'],
    'Travel Essentials': ['Carrying Sling', 'Travel Changing Mat', 'Stroller Fan', 'Travel Bottle Warmer'],
    'Hair & Grooming': ['Baby Hair Brush', 'Gentle Shampoo Comb', 'Detangling Spray (Demo)', 'Nail Clippers'],
    'Seasonal Outfits': ['Rainy Season Outfit', 'Summer Romper', 'Holiday Set', 'Winter Warm Set'],
  }

  const descriptions = [
    'Comfortable and gentle for everyday use.',
    'High quality materials designed for baby skin and safety.',
    'Great value for parents — easy to use and easy to clean.',
    'A reliable choice for growing babies and busy days.',
    'Perfect gift for new moms and families.',
  ]

  const productsToCreate = []

  // create 3 products per category => 60
  for (const cat of createdCategories) {
    const options = productNamesByCategory[cat.name] || ['Baby Item']
    for (let i = 0; i < 3; i++) {
      const tpl = pick(productTemplates)
      const base = pick(options)
      const variant = `#${i + 1}`
      const title = `${base} ${variant} (${cat.name})`
      const price = randInt(1500, 22000)
      const status = tpl.status

      const stockCount = status === 'in_stock' ? randInt(tpl.stockMin, tpl.stockMax) : (status === 'available' ? randInt(8, 120) : 0)

      productsToCreate.push({
        title,
        description: `${pick(descriptions)} Category: ${cat.name}.`,
        price,
        category: cat._id,
        status,
        stockCount: status === 'in_stock' ? stockCount : (status === 'available' ? stockCount : 0),
        images: [makeImage(cat.name, variant)],
        seller: seller._id,
      })
    }
  }

  // Idempotency: only create if DB has fewer than expected products
  const existingCount = await Product.countDocuments({ isDeleted: false })
  if (existingCount > 10) {
    console.log(`Seed skipped: existing product count is ${existingCount}`)
    await mongoose.disconnect()
    return
  }

  for (const p of productsToCreate) {
    await Product.create({
      ...p,
      images: p.images.map((img) => ({ url: img.url, publicId: img.publicId })),
    })
  }

  console.log(`Seeded categories=${createdCategories.length} products=${productsToCreate.length}`)

  await mongoose.disconnect()
}

main().catch(async (err) => {
  console.error(err)
  process.exit(1)
})

