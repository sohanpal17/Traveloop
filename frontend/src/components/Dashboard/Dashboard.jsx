import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { userData } = useAuth();
  const navigate = useNavigate();

  const recentTrips = [
    { id: 1, destination: 'Paris, France', dates: 'Oct 15 - Oct 22, 2026', status: 'Upcoming' },
    { id: 2, destination: 'Tokyo, Japan', dates: 'Dec 01 - Dec 14, 2026', status: 'Planning' },
  ];

  const popularCities = [
    { id: 1, name: 'Kyoto', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=400&q=80' },
    { id: 2, name: 'Rome', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=400&q=80' },
    { id: 3, name: 'Bali', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&q=80' },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-background"></div>
      
      <div className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <h1>Welcome back, {userData?.displayName || 'Traveler'}!</h1>
            <p>Ready for your next adventure?</p>
          </div>
          <button className="plan-trip-btn" onClick={() => navigate('/plan')}>
            + Plan New Trip
          </button>
        </header>

        <div className="dashboard-grid">
          <div className="main-column">
            <section className="dashboard-section" style={{ marginBottom: '30px' }}>
              <h2>Your Upcoming Trips</h2>
              <div className="trips-list">
                {recentTrips.map(trip => (
                  <div key={trip.id} className="trip-card">
                    <div className="trip-info">
                      <h3>{trip.destination}</h3>
                      <p>{trip.dates}</p>
                    </div>
                    <span className="trip-status">{trip.status}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="dashboard-section">
              <h2>Popular Destinations</h2>
              <div className="destinations-grid">
                {popularCities.map(city => (
                  <div key={city.id} className="destination-card">
                    <img src={city.image} alt={city.name} />
                    <div className="destination-overlay">
                      <h4>{city.name}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="side-column">
            <section className="dashboard-section" style={{ marginBottom: '30px' }}>
              <h2>Budget Overview</h2>
              <div className="budget-card">
                <div className="budget-label">Total Estimated for Upcoming Trips</div>
                <div className="budget-amount">$4,250</div>
                <div style={{ color: '#64748b', fontSize: '13px' }}>Across 2 planned trips</div>
              </div>
            </section>

            <section className="dashboard-section">
              <h2>Quick Actions</h2>
              <div className="trips-list">
                <button className="trip-card" style={{ width: '100%', textAlign: 'left', background: 'white', cursor: 'pointer' }}>
                  <div className="trip-info">
                    <h3 style={{ color: '#2E3773' }}>Explore Itineraries</h3>
                    <p>Find inspiration for your next trip</p>
                  </div>
                </button>
                <button className="trip-card" style={{ width: '100%', textAlign: 'left', background: 'white', cursor: 'pointer' }}>
                  <div className="trip-info">
                    <h3 style={{ color: '#2E3773' }}>Travel Documents</h3>
                    <p>Manage your passports and tickets</p>
                  </div>
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
