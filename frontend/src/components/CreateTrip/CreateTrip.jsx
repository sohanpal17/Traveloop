import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import tripService from '../../services/tripService';
import { toast } from 'react-toastify';
import './CreateTrip.css';

const CreateTrip = () => {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    tripName: '',
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
    isPublic: 'false'
  });

  const validateForm = () => {
    const newErrors = {};
    if (!formData.tripName.trim()) newErrors.tripName = 'Trip name is required';
    if (!formData.destination.trim()) newErrors.destination = 'Destination is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors below');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        title: formData.tripName,
        description: formData.destination,
        startDate: formData.startDate,
        endDate: formData.endDate,
        budget: formData.budget,
        isPublic: formData.isPublic
      };

      const created = await tripService.createTrip(payload);
      if (created && created.id) {
        navigate(`/plan/${created.id}`, { state: { trip: created } });
      } else {
        const tripId = Date.now().toString();
        navigate(`/plan/${tripId}`, { state: { trip: { id: tripId, ...payload } } });
      }
    } catch (err) {
      console.error('Create trip failed', err);
      toast.error('Failed to create trip. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  const suggestedDestinations = [
    { name: 'Goa', country: 'India', image: '🏖️' },
    { name: 'Jaipur', country: 'India', image: '🏰' },
    { name: 'Manali', country: 'India', image: '🏔️' },
    { name: 'Paris', country: 'France', image: '🗼' },
    { name: 'Tokyo', country: 'Japan', image: '🗾' },
    { name: 'Bali', country: 'Indonesia', image: '🏝️' },
    { name: 'Dubai', country: 'UAE', image: '🌆' },
    { name: 'Bangkok', country: 'Thailand', image: '🛕' }
  ];

  const handleSelectDestination = (destination) => {
    setFormData(prev => ({
      ...prev,
      destination: `${destination.name}, ${destination.country}`
    }));
  };

  return (
    <div className="create-trip-container">
      <div className="create-trip-background"></div>

      {/* Top Navigation Bar */}
      <nav className="ct-topbar">
        <div className="ct-topbar-content">
          <div className="ct-logo">
            <span className="ct-logo-icon">✈️</span>
            <span className="ct-logo-text">Traveloop</span>
          </div>
          <div className="ct-profile-circle">
            {getInitials(userData?.name)}
          </div>
        </div>
      </nav>

      <div className="create-trip-content">
        {/* Form Section */}
        <div className="ct-form-section">
          <h2 className="ct-section-title">Plan a new trip</h2>
          
          <form className="create-trip-form" onSubmit={handleSubmit}>
            <div className="form-row-inline">
              <div className="form-field-inline">
                <label>Start Date *</label>
                <input 
                  type="date" 
                  name="startDate" 
                  value={formData.startDate} 
                  onChange={handleChange}
                  className={`ct-input ${errors.startDate ? 'error' : ''}`}
                  required
                />
                {errors.startDate && <span className="error-text">{errors.startDate}</span>}
              </div>

              <div className="form-field-inline">
                <label>Select a Place *</label>
                <input 
                  type="text" 
                  name="destination" 
                  value={formData.destination} 
                  onChange={handleChange}
                  placeholder="e.g., Paris, France"
                  className={`ct-input ${errors.destination ? 'error' : ''}`}
                  required
                />
                {errors.destination && <span className="error-text">{errors.destination}</span>}
              </div>

              <div className="form-field-inline">
                <label>Trip Name *</label>
                <input 
                  type="text" 
                  name="tripName" 
                  value={formData.tripName} 
                  onChange={handleChange}
                  placeholder="e.g., Summer Vacation"
                  className={`ct-input ${errors.tripName ? 'error' : ''}`}
                  required
                />
                {errors.tripName && <span className="error-text">{errors.tripName}</span>}
              </div>

              <div className="form-field-inline">
                <label>End Date *</label>
                <input 
                  type="date" 
                  name="endDate" 
                  value={formData.endDate} 
                  onChange={handleChange}
                  className={`ct-input ${errors.endDate ? 'error' : ''}`}
                  required
                />
                {errors.endDate && <span className="error-text">{errors.endDate}</span>}
              </div>
            </div>

            <div className="form-row-inline">
              <div className="form-field-inline">
                <label>Budget (₹)</label>
                <input 
                  type="number" 
                  name="budget" 
                  value={formData.budget} 
                  onChange={handleChange}
                  placeholder="₹0.00"
                  className="ct-input"
                />
              </div>

              <div className="form-field-inline">
                <label>Visibility</label>
                <select name="isPublic" value={formData.isPublic} onChange={handleChange} className="ct-input">
                  <option value="false">Private</option>
                  <option value="true">Public</option>
                </select>
              </div>
            </div>
          </form>
        </div>

        {/* Suggestions Section */}
        <div className="ct-suggestions-section">
          <h3 className="ct-suggestions-title">Suggested Places to Visit</h3>
          
          <div className="ct-suggestions-grid">
            {suggestedDestinations.map((dest, idx) => (
              <div 
                key={idx} 
                className="ct-suggestion-card"
                onClick={() => handleSelectDestination(dest)}
              >
                <div className="ct-suggestion-emoji">{dest.image}</div>
                <div className="ct-suggestion-info">
                  <h4>{dest.name}</h4>
                  <p>{dest.country}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="ct-form-actions">
          <button type="button" className="ct-cancel-btn" onClick={() => navigate('/dashboard')}>
            Cancel
          </button>
          <button 
            type="submit" 
            className="ct-submit-btn" 
            disabled={isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? 'Creating Trip...' : 'Next: Build Itinerary →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTrip;
