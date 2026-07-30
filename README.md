# Resello — Production-Ready MERN Marketplace

**Resello** is an online marketplace web application where users can buy, sell, discover, and save pre-owned products (electronics, fashion, home goods, books, and accessories). Built with modern scalable architecture, Sage Green design system, JWT authentication, and Cloudinary media storage.

---

## 🌟 Tech Stack

### Frontend
- **React 18** with **Vite**
- **Tailwind CSS** (Custom Sage Green & Forest Green design system)
- **React Router DOM v6** (Nested layout routes, protected & guest guards)
- **Axios** (With Bearer token interceptor & 401 state handling)
- **React Context API** (`AuthContext` & `WishlistContext`)
- **Lucide React** (Modern clean icon library)

### Backend
- **Node.js** & **Express.js**
- **MongoDB** & **Mongoose** (Normalized schemas, text search index, status-weighted sorting)
- **JWT** (Stateless authentication with 7-day expiration)
- **bcryptjs** (12-round salted password hashing)
- **Multer** & **Cloudinary** (3 to 10 image upload engine with auto-transformations & memory fallback)

---

## 📁 Project Structure

```text
Resello/
├── backend/
│   ├── config/          # Database (db.js) & Cloudinary (cloudinary.js) setup
│   ├── controllers/     # Route business logic (authController, productController, userController)
│   ├── middleware/      # Auth guard (protect, isProductOwner), Multer 3-10 upload, Error handler
│   ├── models/          # Mongoose schemas (User.js, Product.js)
│   ├── routes/          # API routes (authRoutes, productRoutes, userRoutes)
│   ├── utils/           # Seed script (seed.js), ApiFeatures class, JWT helper
│   ├── .env.example     # Environment template
│   ├── package.json
│   └── server.js        # Express application entry point
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── common/  # Navbar, Footer, Badge, Modal, Toast, SkeletonCard, EmptyState, Route Guards
    │   │   └── product/ # ProductCard, ProductGrid, ProductFilterBar, ImageUploader (3-10 images)
    │   ├── context/     # AuthContext, WishlistContext
    │   ├── hooks/       # useAuth, useDebounce, useWishlist
    │   ├── layouts/     # MainLayout
    │   ├── pages/       # HomePage, ExplorePage, ProductDetailPage, CreateProductPage, EditProductPage, MyListingsPage, SellerProfilePage, WishlistPage, ProfilePage, LoginPage, RegisterPage
    │   ├── services/    # api.js, authService.js, productService.js, userService.js
    │   └── utils/       # formatters.js, constants
    ├── tailwind.config.js # Sage Green design tokens
    ├── vite.config.js     # API proxy rule
    └── package.json
```

---

## 🚀 Quick Start & Setup Guide

### 1. Environment Setup

#### Backend Configuration (`backend/.env`)
Create `backend/.env` (or copy from `backend/.env.example`):
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
MONGO_URI=mongodb://127.0.0.1:27017/resello
JWT_SECRET=resello_jwt_secret_key_2026_super_secure_faang_grade

# Cloudinary Setup (Optional - URL strings used if left blank)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### Frontend Configuration (`frontend/.env`)
Create `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

---

### 2. Install Dependencies

```bash
# Install backend packages
cd backend
npm install

# Install frontend packages
cd ../frontend
npm install
```

---

### 3. Database Seeding (Populate 18 Products & 3 Users)

Ensure your MongoDB service is running locally (`mongodb://127.0.0.1:27017`) or point `MONGO_URI` to a MongoDB Atlas cluster, then run:

```bash
cd backend
npm run seed
```

**Seed Credentials**:
- **Sarah Connor**: `sarah@example.com` / `password123`
- **Alex Rivera**: `alex@example.com` / `password123`
- **Marcus Vance**: `marcus@example.com` / `password123`

---

### 4. Running the Application

#### Start Backend Server
```bash
cd backend
npm run dev
# Express API runs on http://localhost:5000
```

#### Start Frontend Dev Server
```bash
cd frontend
npm run dev
# Vite app runs on http://localhost:5173
```

---

## ✨ Features & Architecture Highlights

1. **Authentication & Session Persistence**:
   - Register, Login, Logout with JWT tokens stored in `localStorage`.
   - Automatic Bearer header injection via Axios interceptor.
   - Profile updating and avatar uploading.

2. **Marketplace Engine**:
   - **Upload Product**: Multi-image Drag & Drop uploader with live preview thumbnails and strict **3 to 10 image validation** on both Frontend and Backend.
   - **Row-Level Ownership Guard**: Only listing owners can edit, delete, or mark an item as `Sold`.
   - **Status Engine**: `Available` items display emerald badges and are sorted first; `Sold` items show a solid Red **SOLD** badge with a 60% opacity & grayscale visual overlay.

3. **Expanded 8-Section Homepage**:
   - 1. Hero Banner
   - 2. Search Bar
   - 3. Popular Categories
   - 4. Featured Products
   - 5. Newest Listings
   - 6. Available Products
   - 7. Recently Sold Products
   - 8. Sell CTA Banner

4. **Discovery & Search**:
   - Multi-attribute text search across title, brand, category, material, and condition.
   - Filters for Category, Condition, Price Range, and Available-only toggle.
   - Sorting by Newest, Oldest, Price Low-to-High, and Price High-to-Low.

5. **Rich Product Detail & Public Seller Profiles**:
   - Image gallery with clickable thumbnails and Prev/Next buttons.
   - Seller information card with direct link to Public Seller Profile (`/seller/:id`).
   - Related products carousel/grid.
   - Wishlist bookmarking with live state sync.

6. **Presentation Polish**:
   - Shimmer `SkeletonCard` loaders, illustrated `EmptyState` views, Toast notifications, smooth hover animations (`group-hover:scale-105`), and mobile-responsive drawer navigation.
