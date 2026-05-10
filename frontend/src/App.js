import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth(); // Ensure 'loading' is correctly exported from Context

  // 1. If still checking the token/session, show NOTHING or a spinner
  // This prevents the instant redirect to login before the user state is set
  if (loading) {
    return <div className="loading-spinner">Verifying session...</div>;
  }

  // 2. Only redirect if we are CERTAIN there is no user and loading is finished
  return user ? children : <Navigate to="/login" replace />;
};
  
// Temporary Dashboard Component
const Dashboard = () => {
  const { userData } = useAuth();

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>Welcome to Traveloop Dashboard!</h1>
      <p>Hello, {userData?.displayName || 'Traveler'}!</p>
      <p>Your dashboard will be implemented in the next phase.</p>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
