import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { MainLayout } from './layouts/MainLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { GuestRoute } from './components/common/GuestRoute';

import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CreateProductPage } from './pages/CreateProductPage';
import { EditProductPage } from './pages/EditProductPage';
import { MyListingsPage } from './pages/MyListingsPage';
import { SellerProfilePage } from './pages/SellerProfilePage';
import { WishlistPage } from './pages/WishlistPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WishlistProvider>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              {/* Public Routes */}
              <Route index element={<HomePage />} />
              <Route path="explore" element={<ExplorePage />} />
              <Route path="product/:id" element={<ProductDetailPage />} />
              <Route path="seller/:id" element={<SellerProfilePage />} />

              {/* Guest Auth Routes */}
              <Route
                path="login"
                element={
                  <GuestRoute>
                    <LoginPage />
                  </GuestRoute>
                }
              />
              <Route
                path="register"
                element={
                  <GuestRoute>
                    <RegisterPage />
                  </GuestRoute>
                }
              />

              {/* Protected Seller / User Routes */}
              <Route
                path="create-listing"
                element={
                  <ProtectedRoute>
                    <CreateProductPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="edit-listing/:id"
                element={
                  <ProtectedRoute>
                    <EditProductPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="my-listings"
                element={
                  <ProtectedRoute>
                    <MyListingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="wishlist"
                element={
                  <ProtectedRoute>
                    <WishlistPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* 404 Fallback */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </WishlistProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
