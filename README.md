# 🍼 Blessing Babyshop — Full-Stack Web Application

A complete buy & sell baby products marketplace built with **React + Vite**, **Node.js + Express**, and **MongoDB Atlas**, deployable on **Render**.

---

## 📁 Project Structure

```
blessing-babyshop/
├── server/          ← Node.js + Express API
│   ├── models/      ← MongoDB schemas (User, Product, Category, Order)
│   ├── routes/      ← REST API routes
│   ├── middleware/  ← JWT auth middleware
│   ├── config/      ← Cloudinary config
│   ├── index.js     ← Server entry point
│   └── .env.example ← Environment variables template
│
└── client/          ← React + Vite frontend
    └── src/
        ├── pages/      ← Landing, Login, Register, Dashboard, Shop, etc.
        ├── components/ ← Navbar, DashLayout, ProductCard, ProductForm
        ├── context/    ← AuthContext, CartContext
        └── api/        ← Axios instance
```

---

## 🚀 Quick Start (Local Development)

### 1. Clone & Install
```bash
# Install all dependencies
npm run install:all
```

### 2. Configure Environment Variables

#### Server (`server/.env`):
```env
PORT=5000
MONGODB_URI=mongodb+srv://USER:PASS@cluster.mongodb.net/blessing_babyshop
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173

# Cloudinary (free at cloudinary.com)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Gmail (enable "App Passwords" in Google account)
EMAIL_USER=youremail@gmail.com
EMAIL_PASS=your_app_password
```

#### Client (`client/.env`):
```env
VITE_API_URL=http://localhost:5000
```

### 3. Run Development Servers
```bash
# Terminal 1 — Start backend
npm run dev:server

# Terminal 2 — Start frontend
npm run dev:client
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

---

## ☁️ Deployment on Render

### Backend (Web Service)
1. Push to GitHub
2. Go to render.com → New Web Service
3. Connect your repo, select the `server` folder
4. **Build command:** `npm install`
5. **Start command:** `node index.js`
6. Add all environment variables from `.env.example`

### Frontend (Static Site)
1. New Static Site on Render
2. Connect same repo, select the `client` folder
3. **Build command:** `npm install && npm run build`
4. **Publish directory:** `dist`
5. Set `VITE_API_URL` to your backend Render URL

### Keep-Alive
The frontend automatically pings `/api/ping` every 5 minutes to prevent the free Render backend from sleeping. No setup needed.

---

## ✨ Features

| Feature | Details |
|---|---|
| 🔐 Auth | Register, Login, JWT tokens, Forgot/Reset Password |
| 👤 Profile | Edit name/username/email, upload photo or snap via camera |
| 📦 Products | Add, edit, delete with images, category, status (available/finished/in_stock) |
| 🏷️ Categories | Pre-defined + user-created custom categories |
| 🔍 Shop & Filter | Filter by price, category, status, search text |
| 🛒 Cart | Add to cart, adjust quantities, persistent in session |
| 💳 Checkout | Demo payments: Visa, Orange Money, MTN MoMo, Stripe |
| 📋 Orders | View order history with order numbers |
| 📸 Camera | Snap profile picture directly from browser |
| 🏓 Keep-Alive | Auto-ping every 5 min to prevent Render sleep |

---

## 🗄️ MongoDB Collections

| Collection | Key Fields |
|---|---|
| `users` | username, name, email, passwordHash, profilePic, role |
| `products` | title, description, price, images, category, status, stockCount, seller |
| `categories` | name, createdBy, isSystem |
| `orders` | buyer, items, totalPrice, paymentMethod, orderNumber, status |

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, React Router v6, Axios, React Hot Toast, React Icons
- **Backend:** Node.js, Express, Mongoose, bcryptjs, JWT, Nodemailer, Multer
- **Database:** MongoDB Atlas
- **Images:** Cloudinary
- **Deployment:** Render

---

## 📝 Notes

- Payment is **demo only** — no real charges are made
- Profile picture upload supports both file picker and live camera snap
- Categories can be created dynamically by any user when adding a product
- All routes under `/dashboard` and related pages are protected (require login)
