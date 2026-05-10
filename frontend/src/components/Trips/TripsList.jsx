import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TripsList.css';

const TripsList = () => {
  const navigate = useNavigate();
  
  // Mock data for trips
  const [trips, setTrips] = useState([
    {
      id: 1,
      name: 'European Summer Backpacking',
      dateRange: 'Jun 10, 2026 - Jul 15, 2026',
      destinations: 5,
      status: 'Upcoming'
    },
    {
      id: 2,
      name: 'Tokyo Tech & Culture',
      dateRange: 'Oct 05, 2026 - Oct 19, 2026',
      destinations: 2,
      status: 'Planning'
    },
    {
      id: 3,
      name: 'Bali Retreat',
      dateRange: 'Jan 12, 2025 - Jan 22, 2025',
      destinations: 1,
      status: 'Completed'
    }
  ]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      setTrips(trips.filter(trip => trip.id !== id));
    }
  };

  return (
    <div className="trips-page-container">
      <div className="trips-background"></div>
      
      <div className="trips-content">
        <header className="trips-header">
          <div>
            <h1>My Trips</h1>
            <p>Manage and access all your planned adventures.</p>
          </div>
          <button className="plan-trip-btn" onClick={() => navigate('/plan')}>
            + Plan New Trip
          </button>
        </header>

        <div className="trips-grid">
          {trips.length === 0 ? (
            <div className="full-trip-card" style={{ justifyContent: 'center', padding: '40px' }}>
              <p style={{ color: '#64748b', fontSize: '18px' }}>You haven't planned any trips yet. Let's get started!</p>
            </div>
          ) : (
            trips.map(trip => (
              <div key={trip.id} className="full-trip-card">
                <div className="trip-details">
                  <h2>{trip.name}</h2>
                  <div className="trip-meta">
                    <div className="meta-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      {trip.dateRange}
                    </div>
                    <div className="meta-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      {trip.destinations} Destination{trip.destinations > 1 ? 's' : ''}
                    </div>
                    <div className="meta-item">
                      <span className="trip-status" style={{ color: '#2E3773', fontWeight: '600' }}>
                        • {trip.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="trip-actions">
                  <button className="action-btn btn-view" onClick={() => navigate(`/trips/${trip.id}`)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    View
                  </button>
                  <button className="action-btn btn-edit" onClick={() => navigate(`/trips/${trip.id}/edit`)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    Edit
                  </button>
                  <button className="action-btn btn-delete" onClick={() => handleDelete(trip.id)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TripsList;
