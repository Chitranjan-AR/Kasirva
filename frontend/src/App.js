import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { NotificationProvider } from './context/NotificationContext';
import { registerSW } from './utils/pwa';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ConsumerDashboard from './pages/consumer/Dashboard';
import ProductCatalog from './pages/consumer/ProductCatalog';
import ProductDetails from './pages/consumer/ProductDetails';
import Cart from './pages/consumer/Cart';
import Checkout from './pages/consumer/Checkout';
import OrderTracking from './pages/consumer/OrderTracking';
import MyOrders from './pages/consumer/MyOrders';
import FarmerDashboard from './pages/farmer/Dashboard';
import FarmerProfile from './pages/farmer/Profile';
import ProductManagement from './pages/farmer/ProductManagement';
import VerifyOTP from './pages/auth/VerifyOTP';
import AdminDashboard from './pages/admin/Dashboard';
import Wishlist from './pages/consumer/Wishlist';
import { AboutUs, Contact, Farmers, HelpCenter, TermsOfService, PrivacyPolicy, FAQ } from './pages/StaticPages';

import './index.css';

// Register PWA
registerSW();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
          <WishlistProvider>
            <CartProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/verify-otp" element={<VerifyOTP />} />
                  <Route path="/products" element={<ProductCatalog />} />
                  <Route path="/products/:id" element={<ProductDetails />} />
                  <Route path="/about"   element={<AboutUs />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/farmers" element={<Farmers />} />
                  <Route path="/help"    element={<HelpCenter />} />
                  <Route path="/terms"   element={<TermsOfService />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/faq"     element={<FAQ />} />
                  
                  {/* Consumer Routes */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute role="consumer">
                      <ConsumerDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/cart" element={
                    <ProtectedRoute role="consumer">
                      <Cart />
                    </ProtectedRoute>
                  } />
                  <Route path="/checkout" element={
                    <ProtectedRoute role="consumer">
                      <Checkout />
                    </ProtectedRoute>
                  } />
                  <Route path="/orders/:id" element={
                    <ProtectedRoute role="consumer">
                      <OrderTracking />
                    </ProtectedRoute>
                  } />
                  <Route path="/my-orders" element={
                    <ProtectedRoute role="consumer">
                      <MyOrders />
                    </ProtectedRoute>
                  } />
                  <Route path="/wishlist" element={
                    <ProtectedRoute role="consumer">
                      <Wishlist />
                    </ProtectedRoute>
                  } />
                  
                  {/* Farmer Routes */}
                  <Route path="/farmer/dashboard" element={
                    <ProtectedRoute role="farmer">
                      <FarmerDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/farmer/profile" element={
                    <ProtectedRoute role="farmer">
                      <FarmerProfile />
                    </ProtectedRoute>
                  } />
                  <Route path="/farmer/products" element={
                    <ProtectedRoute role="farmer">
                      <ProductManagement />
                    </ProtectedRoute>
                  } />
                  
                  {/* Admin Routes */}
                  <Route path="/admin/dashboard" element={
                    <ProtectedRoute role="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                </Routes>
              </main>
              <Footer />
            </div>
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
          </Router>
            </CartProvider>
          </WishlistProvider>
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
