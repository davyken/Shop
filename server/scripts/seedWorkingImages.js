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

const PRODUCT_IMAGES = {
  'Diapers & Wipes': [
    'https://images.pexels.com/photos/8877513/pexels-photo-8877513.jpeg?auto=compress&cs=tinysrgb&w=600&h=450',
    'https://images.pexels.com/photos/7567449/pexels-photo-7567449.jpeg?auto=compress&cs=tinysrgb&w=600&h=450',
    'https://images.pexels.com/photos/887824/pexels-photo-887824.jpeg?auto=compress&cs=tinysrgb&w=600&h=450',
  ],
  'Baby Skincare': [
    'https://images.pexels.com/photos/3736654/pexels-photo-3736654.jpeg?auto=compress&cs=tinysrgb&w=600&h=450',
    'https://images.pexels.com/photos/4021809/pexels-photo-4021809.jpeg?auto=compress&cs=tinysrgb&w=600&h=450',
    'https://images.pexels.com/photos/5848450/pexels-photo-5848450.jpeg?auto=compress&cs=tinysrgb&w=600&h=450',
  ],
  'Feeding Bottles': [
    'https://images.pexels.com/photos/2200012/pexels-photo-2200012.jpeg?auto=compress&cs=tinysrgb&w=600&h=450',
    'https://images.pexels.com/photos/4213392/pexels-photo-4213392.jpeg?auto=compress&cs=tinysrgb&w=600&h=450',
    'https://images.pexels.com/photos/8779295/pexels-photo-8779295.jpeg?auto=compress&cs=tinysrgb&w=600&h=450',
  ],
  'Breastfeeding Supplies': [
    'https://images.pexels.com/photos/4021836/pexels-photo-4021836.jpeg?auto=compress&cs=tinysrgb&w=600&h=450',
    'https://images.pexels.com/photos/4021811/pexels-photo-4021811.jpeg?auto=compress&cs=tinysrgb&w=600&h=450',
    'https://images.pexels.com/photos/4021822/pexels-photo-4021822.jpeg?auto=compress&cs=tinysrgb&w=600&h=450',
  ],
  'Baby Clothing': [
    'https://images.pexels.com/photos/1517281898/pexels-photo-1517281898/pexels-photo-1517281898.jpeg?auto=compress&cs=tinysrgb&w=600&h=450',
    'https://images.pexels.com/photos/4709283/pexels-photo-4709283.jpeg?auto=compress&cs=tinysrgb&w=600&h=450',
    'https://images.pexels.com/photos/1638327859982/pexels-photo-1638327859982/pexels-photo-1638327859982.jpeg?auto=compress&cs=tinysrgb&w=600&h=450',
  ],
  'Baby Shoes & Socks': [
    'https://images.pexels.com/photos/2986676/pexels-photo-2986676.jpeg?auto=compress&cs=tinysrgb&w=600&h=450',
    'https://images.pexels.com/photos/6551182/pexels-photo-6551182.jpeg?auto=compress&cs=tinysrgb&w=600&h=450',
    'https://images.pexels.com/photos/5486925/pexels-photo-5486925.jpeg?auto=compress&cs=tinysrgb&w=600&h=450',
  ],
  'Toys & Games': [
    'https://images.pexels.com/photos/1642304/pexels-photo-1642304.jpeg?auto=compress&cs=tinysrgb&w=600&h=450',
    'https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=600&h=450',
    'https://images.pexels.com/photos/1912868/pexels-photo-1912868.jpeg?auto=compress&cs=tinysrgb&w=600&h=450',
  ],
  'Bath & Potty': [
    'https://images.pexels.com/photos/3729533/pexels-photo-3729533.jpeg?auto=compress&cs=tinysrgb&w=600&h=450',
    'https://images.pexels.com/photos/3856433/pexels-photo-3856433.jpeg?auto=compress&cs=tinysrgb&w=600&h=450',
    'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=600&h=450',
  ],
  'Strollers & Car Seats': [
    'https://images.pexels.com/photos/8112068/pexels-photo-8112068.jpeg?auto=compress&cs=tinysrgb&w=600&h=450',
    'https://images.pexels.com/photos/4705622/pexels-photo-4705622.jpeg?auto=compress&cs=tinysrgb&w=600&h=450',
    'https://images.pexels.com/photos/6388893/pexels-photo-6388893.jpeg?auto=compress&cs=tinysrgb&w=600&h=450',
  ],
  'Baby Bedding': [
    'https://images.pexels.com/photos/5848449/pexels-photo-5848449.jpeg?auto=compress&cs=tinysrgb&w=600&h=450',
    'https://images.pexels.com/photos/5853476/pexels-photo-5853476.jpeg?auto=compress&cs=tinysrgb&w=600&h=450',
    'https://images.pexels.com/photos/6002549/pexels-photo-6002549.jpeg?auto=compress&cs=tinysrgb&w=600&h=450',
  ],
  'Teethers & Pacifiers': [
    'https://images.pexels.com/photos/5792215/pexels-photo-5792215.jpeg?auto=compress&cs=tinysrgb&w=600&h=450',
    'https://images.pexels.com/photos/5792217/pexels-photo-5792217.jpeg?auto=compress&cs=tinysrgb&w=600&h=450',
    'https://images.pexels.com/photos/5792131/pexels-photo-5792131.jpeg?auto=compress&cs=tinysrgb&w=600&h=450',
  ],
  'Diaper Bags': [
    'https://images.pexels.com/photos/7991155/pexels-photo-7991155.jpeg?auto=compress&cs=tinysrgb&w=600&h=450',
    'https://images.pexels.com/photos/7991159/pexels-photo-7991159.jpeg?auto=compress&cs=tinysrgb&w=600&h=450',
    'https://images.pexels.com/photos/7758680/pexels-photo-7758680.jpeg?auto=compress&cs=tinysrgb&w=600&h=450',
  ],
  'Swaddles & Blankets': [
    'https://images.pexels.com/photos/5482304/pexels-photo-5482304.jpeg?auto=compress&cs=tinysrgb&w=600&h=450',
    'https://images.pexels.com/photos/5648526/pexels-photo-5648526.jpeg?auto=compress&cs=tinysrgb&w=600&h=450',
    'https://images.pexels.com/photos/5905542/pexels-photo-5905542.jpeg?auto=compress&cs=tinysrgb&w=600&h=450',
  ],
  'Baby Health': [
    'https://images.pexels.com/photos/4980288/pexels-photo-4980288.jpeg?auto=compress&cs=tinysrgb&w=600&h=450',
    'https://images.pexels.com/photos/4980292/pexels-photo-4980292.jpeg?auto=compress&cs=tinysrgb&w=600&h=450',
    'https://images.pexels.com/photos/4980294/pexels-photo-4980294.jpeg?auto=compress&cs=tinysrgb&w=600&h=450',
  ],
  'Nursery Furniture': [
    'https://images.pexels.com/photos/6489102/pexels-photo-6489102.jpeg?auto=compress&cs=tinysrgb&w=600&h=450',
    'https://images.pexels.com/photos/6489107/pexels-photo-6489107.jpeg?auto=compress&cs=tinysrgb&w=600&h=450',
    'https://images.pexels.com/photos/6489126/pexels-photo-6489126.jpeg?auto=compress&cs=tinysrgb&w=600&h=450',
  ],
  'Newborn Essentials': [
    'https://images.pexels.com/photos/1287427/pexels-photo-1287427.jpeg?auto=compress&cs=tinysrgb&w=600&h=450',
    'https://images.pexels.com/photos/1046589/pexels-photo-1046589.jpeg?auto=compress&cs=tinysrgb&w=600&h=450',
    'https://images.pexels.com/photos/1915048/pexels-photo-1915048.jpeg?auto=compress&cs=tinysrgb&w=600&h=450',
  ],
  'Learning & Education': [
    'https://images.pexels.com/photos/1721929/pexels-photo-1721929.jpeg?auto=compress&cs=tinysrgb&w=600&h=450',
    'https://images.pexels.com/photos/1158419/pexels-photo-1158419.jpeg?auto=compress&cs=tinysrgb&w=600&h=450',
    'https://images.pexels.com/photos/1497210/pexels-photo-1497210.jpeg?auto=compress&cs=tinysrgb&w=600&h=450',
  ],
  'Travel Essentials': [
    'https://images.pexels.com/photos/1032370/pexels-photo-1032370.jpeg?auto=compress&cs=tinysrgb&w=600&h=450',
    'https://images.pexels.com/photos/5632232/pexels-photo-5632232.jpeg?auto=compress&cs=tinysrgb&w=600&h=450',
    'https://images.pexels.com/photos/6964657/pexels-photo-6964657.jpeg?auto=compress&cs=tinysrgb&w=600&h=450',
  ],
  'Hair & Grooming': [
    'https://images.pexels.com/photos/5221572/pexels-photo-5221572.jpeg?auto=compress&cs=tinysrgb&w=600&h=450',
    'https://images.pexels.com/photos/7841571/pexels-photo-7841571.jpeg?auto=compress&cs=tinysrgb&w=600&h=450',
    'https://images.pexels.com/photos/7841576/pexels-photo-7841576.jpeg?auto=compress&cs=tinysrgb&w=600&h=450',
  ],
  'Seasonal Outfits': [
    'https://images.pexels.com/photos/5632406/pexels-photo-5632406.jpeg?auto=compress&cs=tinysrgb&w=600&h=450',
    'https://images.pexels.com/photos/1055693/pexels-photo-1055693.jpeg?auto=compress&cs=tinysrgb&w=600&h=450',
    'https://images.pexels.com/photos/8632074/pexels-photo-8632074.jpeg?auto=compress&cs=tinysrgb&w=600&h=450',
  ],
}

const FALLBACK = [
  'https://images.pexels.com/photos/1287427/pexels-photo-1287427.jpeg?auto=compress&cs=tinysrgb&w=600&h=450'
]

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

  console.log('Deleting all existing products...')
  await Product.deleteMany({})
  console.log('✓ All products deleted')

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

  console.log('Found categories:', categories.map(c => c.name))

  const productsToCreate = []

  for (const cat of categories) {
    const catKey = cat.name
    const images = PRODUCT_IMAGES[catKey] || FALLBACK
    const options = productNamesByCategory[catKey] || ['Baby Item']

    for (let i = 0; i < 3; i++) {
      const base = pick(options)
      const variant = `#${i + 1}`
      const title = `${base} ${variant} (${catKey})`
      const price = randInt(1500, 22000)
      const stockCount = randInt(5, 50)

      const selectedUrl = images[i % images.length]

      productsToCreate.push({
        title,
        description: `High quality ${base.toLowerCase()} designed for baby comfort and safety. Perfect for ${catKey.toLowerCase()}.`,
        price,
        category: cat._id,
        status: 'available',
        stockCount,
        images: [{ url: selectedUrl, publicId: `product-${cat._id}-${i}` }],
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
  console.log('\nVerifying 5 products:')
  const samples = await Product.find({ isDeleted: false }).limit(5)
  samples.forEach((p, i) => {
    console.log(`${i+1}. ${p.title}`)
    console.log(`   ${p.images[0]?.url}`)
  })

  await mongoose.disconnect()
}

main().catch(async (err) => {
  console.error(err)
  await mongoose.disconnect()
  process.exit(1)
})
