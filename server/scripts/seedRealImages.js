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

// Real baby product images from Unsplash curated
const IMAGE_DATA = [
  // Diapers & Wipes
  { keyword: 'diapers', urls: [
    'https://images.unsplash.com/photo-1543083476943-70bb3a6b5fab?w=600&h=450&fit=crop',
    'https://images.unsplash.com/photo-1584839348812-6a3c5bd4d60a?w=600&h=450&fit=crop',
    'https://images.unsplash.com/photo-1511311258050-dc3f9a4b5f1d?w=600&h=450&fit=crop',
  ]},
  // Baby Skincare
  { keyword: 'baby lotion', urls: [
    'https://images.unsplash.com/photo-1583306093919-20f1d6d1c7c5?w=600&h=450&fit=crop',
    'https://images.unsplash.com/photo-1600428877878-1a0fd85beda8?w=600&h=450&fit=crop',
    'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=600&h=450&fit=crop',
  ]},
  // Feeding Bottles
  { keyword: 'baby bottle', urls: [
    'https://images.unsplash.com/photo-1576185081166-651fd64f44e8?w=600&h=450&fit=crop',
    'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&h=450&fit=crop',
    'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&h=450&fit=crop',
  ]},
  // Breastfeeding Supplies
  { keyword: 'breast pump', urls: [
    'https://images.unsplash.com/photo-1596462502754-646014161596?w=600&h=450&fit=crop',
    'https://images.unsplash.com/photo-1519331379826-f10e5489dc84?w=600&h=450&fit=crop',
    'https://images.unsplash.com/photo-1596822363710-530419926183?w=600&h=450&fit=crop',
  ]},
  // Baby Clothing
  { keyword: 'baby clothes', urls: [
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=450&fit=crop',
    'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600&h=450&fit=crop',
    'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=600&h=450&fit=crop',
  ]},
  // Baby Shoes & Socks
  { keyword: 'baby shoes', urls: [
    'https://images.unsplash.com/photo-1558908479-9c4183ea0969?w=600&h=450&fit=crop',
    'https://images.unsplash.com/photo-1571863533956-01c88e79957e?w=600&h=450&fit=crop',
    'https://images.unsplash.com/photo-1584255852837-9ec08a8666ec?w=600&h=450&fit=crop',
  ]},
  // Toys & Games
  { keyword: 'baby toys', urls: [
    'https://images.unsplash.com/photo-1596464716127-f9a0859d2c09?w=600&h=450&fit=crop',
    'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=600&h=450&fit=crop',
    'https://images.unsplash.com/photo-1596813362035-3b4c0e4b879d?w=600&h=450&fit=crop',
  ]},
  // Bath & Potty
  { keyword: 'baby bath', urls: [
    'https://images.unsplash.com/photo-1544126592-807ade215a0b?w=600&h=450&fit=crop',
    'https://images.unsplash.com/photo-1559757175-ebebde65494d?w=600&h=450&fit=crop',
    'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&h=450&fit=crop',
  ]},
  // Strollers & Car Seats
  { keyword: 'stroller', urls: [
    'https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?w=600&h=450&fit=crop',
    'https://images.unsplash.com/photo-1586759003406-576e628c7332?w=600&h=450&fit=crop',
    'https://images.unsplash.com/photo-1603487742131-4161526a3f9a?w=600&h=450&fit=crop',
  ]},
  // Baby Bedding
  { keyword: 'baby bedding', urls: [
    'https://images.unsplash.com/photo-1596464716127-f9a0859d2c09?w=600&h=450&fit=crop',
    'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=600&h=450&fit=crop',
    'https://images.unsplash.com/photo-1596813362035-3b4c0e4b879d?w=600&h=450&fit=crop',
  ]},
  // Teethers & Pacifiers
  { keyword: 'teether', urls: [
    'https://images.unsplash.com/photo-1589032379250-6ddd95092e04?w=600&h=450&fit=crop',
    'https://images.unsplash.com/photo-1614728853913-1e2211207bc1?w=600&h=450&fit=crop',
    'https://images.unsplash.com/photo-1596501113446-3aa1c8080f8b?w=600&h=450&fit=crop',
  ]},
  // Diaper Bags
  { keyword: 'diaper bag', urls: [
    'https://images.unsplash.com/photo-1605733513597-a8f8341084e6?w=600&h=450&fit=crop',
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=450&fit=crop',
    'https://images.unsplash.com/photo-1583863788436-3884a17a890a?w=600&h=450&fit=crop',
  ]},
  // Swaddles & Blankets
  { keyword: 'baby blanket', urls: [
    'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=600&h=450&fit=crop',
    'https://images.unsplash.com/photo-1578642975566-3d4853a82d32?w=600&h=450&fit=crop',
    'https://images.unsplash.com/photo-1597137968393-7fa87442ea65?w=600&h=450&fit=crop',
  ]},
  // Baby Health
  { keyword: 'baby thermometer', urls: [
    'https://images.unsplash.com/photo-1537365587683-009b4e1f4bf9?w=600&h=450&fit=crop',
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&h=450&fit=crop',
    'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&h=450&fit=crop',
  ]},
  // Nursery Furniture
  { keyword: 'nursery furniture', urls: [
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=450&fit=crop',
    'https://images.unsplash.com/photo-1505852679233-d9fd70aff56d?w=600&h=450&fit=crop',
    'https://images.unsplash.com/photo-1562059390-a761a084768e?w=600&h=450&fit=crop',
  ]},
  // Newborn Essentials
  { keyword: 'newborn essentials', urls: [
    'https://images.unsplash.com/photo-1519485542323-6e423f5a218d?w=600&h=450&fit=crop',
    'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?w=600&h=450&fit=crop',
    'https://images.unsplash.com/photo-1486495302237-4ce7a54561a7?w=600&h=450&fit=crop',
  ]},
  // Learning & Education
  { keyword: 'learning toys', urls: [
    'https://images.unsplash.com/photo-1541649899411-07f871d31bb6?w=600&h=450&fit=crop',
    'https://images.unsplash.com/photo-15616992264-bba16e52f8ed?w=600&h=450&fit=crop',
    'https://images.unsplash.com/photo-1596727147705-54a9d6ed27e6?w=600&h=450&fit=crop',
  ]},
  // Travel Essentials
  { keyword: 'baby carrier', urls: [
    'https://images.unsplash.com/photo-1591046029137-1027c1f6ea80?w=600&h=450&fit=crop',
    'https://images.unsplash.com/photo-1587395608223-47064916d4e9?w=600&h=450&fit=crop',
    'https://images.unsplash.com/photo-1576057627139-011fee588081?w=600&h=450&fit=crop',
  ]},
  // Hair & Grooming
  { keyword: 'baby grooming', urls: [
    'https://images.unsplash.com/photo-1633932507876-27gm40g4e68?w=600&h=450&fit=crop',
    'https://images.unsplash.com/photo-1606499026371-197737329919?w=600&h=450&fit=crop',
    'https://images.unsplash.com/photo-1562352774141-3a0e77579d1d?w=600&h=450&fit=crop',
  ]},
  // Seasonal Outfits
  { keyword: 'baby outfit', urls: [
    'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=600&h=450&fit=crop',
    'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=600&h=450&fit=crop',
    'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600&h=450&fit=crop',
  ]},
]

function makeImage(catKeyword, variant) {
  const dataSet = IMAGE_DATA.find(d => d.keyword === catKeyword) || IMAGE_DATA[0]
  const url = pick(dataSet.urls)
  return {
    url,
    publicId: `unsplash-${catKeyword}-${variant}-${Date.now()}`,
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

  console.log('Deleting all non-system products...')
  await Product.deleteMany({})
  console.log('✓ All products deleted')

  const categories = await Category.find({})
  const seller = await ensureSeller()

  const statuses = ['available', 'in_stock', 'available']
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

  const createdCategories = []
  for (const cat of categories) {
    createdCategories.push(cat)
  }

  const productsToCreate = []

  for (const cat of createdCategories) {
    const options = productNamesByCategory[cat.name] || ['Baby Item']
    for (let i = 0; i < 3; i++) {
      const base = pick(options)
      const variant = `#${i + 1}`
      const title = `${base} ${variant} (${cat.name})`
      const price = randInt(1500, 22000)
      const status = 'available'
      const stockCount = randInt(5, 50)

      productsToCreate.push({
        title,
        description: `High quality ${base.toLowerCase()} designed for baby comfort and safety. Perfect for ${cat.name.toLowerCase()}.`,
        price,
        category: cat._id,
        status,
        stockCount,
        images: [makeImage(cat.name.toLowerCase().replace(/\s+/g, '_'), variant)],
        seller: seller._id,
      })
    }
  }

  console.log(`Seeding ${productsToCreate.length} products with real Unsplash images...`)

  for (const p of productsToCreate) {
    await Product.create({
      ...p,
      images: p.images.map(img => ({ url: img.url, publicId: img.publicId })),
    })
  }

  console.log(`✓ Seeded categories=${createdCategories.length} products=${productsToCreate.length}`)
  console.log('\nSample products:')
  const sample = await Product.find({ isDeleted: false }).limit(3)
  sample.forEach((p, i) => {
    console.log(`${i+1}. ${p.title}`)
    console.log(`   Image: ${p.images[0]?.url}`)
  })

  await mongoose.disconnect()
}

main().catch(async (err) => {
  console.error(err)
  await mongoose.disconnect()
  process.exit(1)
})
