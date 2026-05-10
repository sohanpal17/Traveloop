import React from 'react';
import { useAuth } from '../context/AuthContext';
import TripForm from './Trips/TripForm'; // Adjusted to find the folder you created

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-wrapper" style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar Navigation */}
      <nav style={{ width: '250px', background: '#1a1a1a', color: 'white', padding: '20px', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ color: '#3498db' }}>Traveloop</h2>
        <ul style={{ listStyle: 'none', padding: 0, marginTop: '40px', flex: 1 }}>
          <li style={{ marginBottom: '20px', cursor: 'pointer', fontSize: '18px' }}>🌍 My Trips</li>
        </ul>
        <button 
          onClick={logout}
          style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}
        >
          Logout
        </button>
      </nav>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '40px', backgroundColor: '#f9f9f9' }}>
        <header style={{ marginBottom: '30px' }}>
          <h1>Welcome, {user?.name || 'Traveler'}!</h1>
          <p>Where are we heading next?</p>
        </header>

        {/* Feature: Trip Creation Form */}
        <section style={{ maxWidth: '500px', background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <TripForm onTripCreated={() => window.location.reload()} />
        </section>
      </main>
    </div>
  );
};

export default Dashboard;