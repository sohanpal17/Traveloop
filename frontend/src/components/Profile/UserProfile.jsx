import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './UserProfile.css';

const UserProfile = () => {
  const { userData } = useAuth();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: userData?.displayName || 'Alex Wanderer',
    email: userData?.email || 'alex.wanderer@example.com',
    photoUrl: userData?.photoUrl || '',
    language: 'English'
  });

  // Database-structured trip data
  const trips = [
    { id: 1, title: 'Summer in Paris', start_date: '2026-07-15', end_date: '2026-07-25', cover_photo_url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=400&q=80', status: 'upcoming' },
    { id: 2, title: 'Tokyo Exploration', start_date: '2026-10-05', end_date: '2026-10-15', cover_photo_url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=400&q=80', status: 'upcoming' },
    { id: 3, title: 'Swiss Alps Hiking', start_date: '2026-12-10', end_date: '2026-12-20', cover_photo_url: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=400&q=80', status: 'upcoming' },
    { id: 4, title: 'Rome Getaway', start_date: '2025-05-10', end_date: '2025-05-17', cover_photo_url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=400&q=80', status: 'completed' },
    { id: 5, title: 'Bali Retreat', start_date: '2024-12-01', end_date: '2024-12-10', cover_photo_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&q=80', status: 'completed' }
  ];

  const today = new Date().toISOString().split('T')[0];
  const preplannedTrips = trips.filter(trip => trip.start_date >= today);
  const previousTrips = trips.filter(trip => trip.start_date < today);

  return (
    <div className="profile-container">
      <div className="profile-background"></div>
      
      <nav className="profile-navbar">
        <div className="nav-logo" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>Traveloop</div>
        <button className="back-link" onClick={() => navigate('/dashboard')}>← Back to Dashboard</button>
      </nav>

      <div className="profile-content">
        <div className="profile-top-section">
          {/* User Image Area */}
          <div className="profile-image-container">
            {profileData.photoUrl ? (
              <img src={profileData.photoUrl} alt="User" className="profile-image" />
            ) : (
              <div className="profile-image-placeholder">
                <span>{profileData.displayName.charAt(0)}</span>
              </div>
            )}
            {isEditing && (
              <button className="btn-change-photo">Change Photo</button>
            )}
          </div>

          {/* User Info */}
          <div className="profile-user-info">
            <h1>{profileData.displayName}</h1>
            <p className="user-email">{profileData.email}</p>
            <button 
              className="btn-edit-profile"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Save' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {/* Trips Section */}
        <div className="profile-trips-section">
          <div className="section-header">
            <h2>My Trips</h2>
            <p className="section-subtext">Manage all your planned and completed trips</p>
          </div>

          {/* Upcoming Trips */}
          {preplannedTrips.length > 0 && (
            <div className="trips-subsection">
              <h3>Upcoming Trips ({preplannedTrips.length})</h3>
              <div className="trips-grid">
                {preplannedTrips.map(trip => (
                  <div 
                    key={trip.id}
                    className="trip-card"
                    style={{ backgroundImage: `url(${trip.cover_photo_url})` }}
                    onClick={() => navigate(`/trips/${trip.id}`)}
                  >
                    <div className="trip-card-overlay"></div>
                    <div className="trip-card-content">
                      <h3>{trip.title}</h3>
                      <p>📅 {trip.start_date}</p>
                      <button className="btn-view-trip">View Trip →</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Previous Trips */}
          {previousTrips.length > 0 && (
            <div className="trips-subsection">
              <h3>Previous Trips ({previousTrips.length})</h3>
              <div className="trips-grid">
                {previousTrips.map(trip => (
                  <div 
                    key={trip.id}
                    className="trip-card completed"
                    style={{ backgroundImage: `url(${trip.cover_photo_url})` }}
                    onClick={() => navigate(`/trips/${trip.id}`)}
                  >
                    <div className="trip-card-overlay"></div>
                    <div className="trip-card-content">
                      <h3>{trip.title}</h3>
                      <p>✓ Completed</p>
                      <button className="btn-view-trip">View Trip →</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {trips.length === 0 && (
            <div className="no-trips">
              <p>No trips yet. Let's plan your next adventure!</p>
              <button 
                className="btn-create-trip"
                onClick={() => navigate('/create-trip')}
              >
                Create Your First Trip
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
