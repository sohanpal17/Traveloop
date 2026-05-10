import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './CreateTrip.css';

const CreateTrip = () => {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [formData, setFormData] = useState({
    tripName: '',
    destination: '',
    startDate: '',
    endDate: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Trip Data:', formData);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="create-trip-container">
      {/* Header */}
      <header className="create-trip-header">
        <div className="logo" onClick={() => navigate('/dashboard')} style={{cursor: 'pointer'}}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Traveloop</span>
        </div>
        <div className="user-profile">
          <div className="avatar">{getInitials(userData?.displayName)}</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="create-trip-main">
        {/* Form Section */}
        <section className="plan-trip-section">
          <h2>Plan a new trip</h2>
          <div className="form-card">
            <form onSubmit={handleSubmit} className="trip-form">
              <div className="form-row">
                <label>Trip Name:</label>
                <input 
                  type="text" 
                  name="tripName" 
                  value={formData.tripName} 
                  onChange={handleChange} 
                  placeholder="e.g. Summer Vacation"
                />
              </div>
              <div className="form-row">
                <label>Select a Place :</label>
                <input 
                  type="text" 
                  name="destination" 
                  value={formData.destination} 
                  onChange={handleChange} 
                  placeholder="e.g. Paris, France"
                />
              </div>
              <div className="form-row">
                <label>Start Date:</label>
                <input 
                  type="date" 
                  name="startDate" 
                  value={formData.startDate} 
                  onChange={handleChange} 
                />
              </div>
              <div className="form-row">
                <label>End Date:</label>
                <input 
                  type="date" 
                  name="endDate" 
                  value={formData.endDate} 
                  onChange={handleChange} 
                />
              </div>
            </form>
          </div>
        </section>

        {/* Suggestions Section */}
        <section className="suggestions-section">
          <h2>Suggestion for Places to Visit/Activites to preform</h2>
          <div className="suggestions-grid">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="suggestion-card">
                <div className="suggestion-image-placeholder"></div>
                <div className="suggestion-content">
                  <h3>Suggestion {item}</h3>
                  <p>Explore this amazing place.</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default CreateTrip;
