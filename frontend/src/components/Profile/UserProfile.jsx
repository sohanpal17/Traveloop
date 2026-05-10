import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './UserProfile.css';

const UserProfile = () => {
  const { userData } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: userData?.displayName || 'Alex Wanderer',
    email: userData?.email || 'alex.wanderer@example.com',
    photoUrl: userData?.photoUrl || '',
    language: 'English'
  });

  // Database-structured trip data
  const trips = [
    { id: 1, title: 'Summer in Paris', start_date: '2026-07-15', end_date: '2026-07-25', cover_photo_url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=400&q=80' },
    { id: 2, title: 'Tokyo Exploration', start_date: '2026-10-05', end_date: '2026-10-15', cover_photo_url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=400&q=80' },
    { id: 3, title: 'Swiss Alps Hiking', start_date: '2026-12-10', end_date: '2026-12-20', cover_photo_url: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=400&q=80' },
    { id: 4, title: 'Rome Getaway', start_date: '2025-05-10', end_date: '2025-05-17', cover_photo_url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=400&q=80' },
    { id: 5, title: 'Bali Retreat', start_date: '2024-12-01', end_date: '2024-12-10', cover_photo_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&q=80' }
  ];

  const today = new Date().toISOString().split('T')[0];
  const preplannedTrips = trips.filter(trip => trip.start_date >= today);
  const previousTrips = trips.filter(trip => trip.start_date < today);

  return (
    <div className="profile-container">
      <div className="profile-background"></div>
      
      <nav className="profile-navbar">
        <div className="nav-logo">Traveloop</div>
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

          {/* User Details Area */}
          <div className="profile-details-container">
            <div className="details-header">
              <h2>User Details</h2>
              <button 
                className="btn-edit-profile"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </button>
            </div>

            <div className="details-form">
              <div className="form-group">
                <label>Display Name</label>
                <input 
                  type="text" 
                  value={profileData.displayName}
                  disabled={!isEditing}
                  onChange={(e) => setProfileData({...profileData, displayName: e.target.value})}
                  className={!isEditing ? 'disabled-input' : ''}
                />
              </div>
              
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  value={profileData.email}
                  disabled={!isEditing}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  className={!isEditing ? 'disabled-input' : ''}
                />
              </div>

              <div className="form-group">
                <label>Language Preference</label>
                <select 
                  value={profileData.language}
                  disabled={!isEditing}
                  onChange={(e) => setProfileData({...profileData, language: e.target.value})}
                  className={!isEditing ? 'disabled-input' : ''}
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                </select>
              </div>

              {isEditing && (
                <div className="danger-zone">
                  <button className="btn-delete-account">Delete Account</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Trips Sections */}
        <div className="trips-section">
          <h3 className="section-title">Preplanned Trips</h3>
          <div className="trips-grid">
            {preplannedTrips.map(trip => (
              <div key={trip.id} className="trip-card-vertical">
                <div className="trip-image" style={{ backgroundImage: `url(${trip.cover_photo_url})` }}></div>
                <div className="trip-info">
                  <h4>{trip.title}</h4>
                  <p>{new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}</p>
                  <button className="btn-view-trip">View</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="trips-section">
          <h3 className="section-title">Previous Trips</h3>
          <div className="trips-grid">
            {previousTrips.map(trip => (
              <div key={trip.id} className="trip-card-vertical">
                <div className="trip-image" style={{ backgroundImage: `url(${trip.cover_photo_url})` }}></div>
                <div className="trip-info">
                  <h4>{trip.title}</h4>
                  <p>{new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}</p>
                  <button className="btn-view-trip">View</button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserProfile;
