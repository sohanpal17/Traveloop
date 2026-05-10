import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Dashboard from './components/Dashboard/Dashboard';
import TripsList from './components/Trips/TripsList';
import TripDetails from './components/Trips/TripDetails';
import CreateTrip from './components/CreateTrip/CreateTrip';
import ItineraryBuilder from './components/Trips/ItineraryBuilder';
import ItineraryView from './components/Trips/ItineraryView';
import PackingChecklist from './components/Trips/PackingChecklist';
import SharedItinerary from './components/Trips/SharedItinerary';
import TripNotes from './components/Trips/TripNotes';
import ExpenseInvoice from './components/Trips/ExpenseInvoice';
import CommunityTab from './components/Community/CommunityTab';
import CitySearch from './components/CitySearch/CitySearch';
import UserProfile from './components/Profile/UserProfile';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner-large"></div>
      </div>
    );
  }

  return currentUser ? children : <Navigate to="/login" />;
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
            <Route
              path="/trips"
              element={
                <ProtectedRoute>
                  <TripsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-trip"
              element={
                <ProtectedRoute>
                  <TripDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/plan/:tripId"
              element={
                <ProtectedRoute>
                  <ItineraryBuilder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trips/:tripId"
              element={
                <ProtectedRoute>
                  <ItineraryView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/packing/:tripId"
              element={
                <ProtectedRoute>
                  <PackingChecklist />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/community"
              element={
                <ProtectedRoute>
                  <CommunityTab />
                </ProtectedRoute>
              }
            />
            <Route
              path="/city-search"
              element={
                <ProtectedRoute>
                  <CitySearch />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tripnotes"
              element={
                <ProtectedRoute>
                  <TripNotes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/expenses"
              element={
                <ProtectedRoute>
                  <ExpenseInvoice />
                </ProtectedRoute>
              }
            />
            <Route
              path="/shared/:slug"
              element={<SharedItinerary />}
            />
            <Route path="/" element={<Navigate to="/dashboard" />} />
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
