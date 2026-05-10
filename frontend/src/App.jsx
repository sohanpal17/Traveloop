import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';

// Auth Components
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';

// Feature Components
import Dashboard from './components/Dashboard'; 
import Explore from './pages/Explore';
import Profile from './pages/Profile';
import TripDetails from './pages/TripDetails'; // <--- THIS WAS MISSING

import './App.css';

// Simple ProtectedRoute wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Secure Private Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          
          <Route path="/explore" element={
            <ProtectedRoute><Explore /></ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />
          
          <Route path="/trip/:id" element={
            <ProtectedRoute><TripDetails /></ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;