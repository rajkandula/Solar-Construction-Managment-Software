import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Auth Provider
import { AuthProvider } from './contexts/AuthContext';

// Layout Components
import Navbar from './components/layout/Navbar'; 
import Footer from './components/layout/Footer';

// Page Components
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CreateOrderPage from './pages/CreateOrderPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import StaffOrdersPage from './pages/StaffOrdersPage'; 
import StaffOrderDetailPage from './pages/StaffOrderDetailPage'; // Import the new detail page

// ProtectedRoute Component
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-gray-100">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* User Protected Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/create-order" 
                element={
                  <ProtectedRoute>
                    <CreateOrderPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/order-history" 
                element={
                  <ProtectedRoute> 
                    <OrderHistoryPage />
                  </ProtectedRoute>
                } 
              />

              {/* Staff Protected Routes */}
              <Route 
                path="/staff/orders" 
                element={
                  <ProtectedRoute allowedRoles={['sales', 'manager', 'construction', 'admin']}>
                    <StaffOrdersPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/staff/orders/:orderId" 
                element={
                  <ProtectedRoute allowedRoles={['sales', 'manager', 'construction', 'admin']}>
                    <StaffOrderDetailPage />
                  </ProtectedRoute>
                } 
              />
              
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
