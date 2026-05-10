import React from 'react';
import './CreateTrip.css';

/**
 * CreateTrip — Skeleton page for teammate integration.
 * 
 * Backend schema reference (tripModel.js):
 *   - title (string, required)
 *   - description (string)
 *   - start_date (date)
 *   - end_date (date)
 *   - cover_photo_url (string)
 *   - total_budget (decimal, default 0)
 *   - is_public (boolean, default false)
 * 
 * After saving a trip, redirect to /plan/:tripId to build the itinerary.
 */
const CreateTrip = () => {
  return (
    <div className="create-trip-container">
      <div className="create-trip-background"></div>
      
      <div className="create-trip-content">
        <header className="create-trip-header">
          <h1>Create a New Trip</h1>
          <p>Fill in the details below to start planning your adventure.</p>
        </header>

        <div className="create-trip-card">
          {/* TEAMMATE: Replace this placeholder with your form implementation */}
          <form className="create-trip-form">
            <div className="form-row">
              <div className="form-field">
                <label>Trip Title *</label>
                <input type="text" placeholder="e.g., Summer in Europe 2026" className="ct-input" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label>Description</label>
                <textarea placeholder="Describe your trip..." rows="3" className="ct-input ct-textarea"></textarea>
              </div>
            </div>

            <div className="form-row two-col">
              <div className="form-field">
                <label>Start Date *</label>
                <input type="date" className="ct-input" />
              </div>
              <div className="form-field">
                <label>End Date *</label>
                <input type="date" className="ct-input" />
              </div>
            </div>

            <div className="form-row two-col">
              <div className="form-field">
                <label>Total Budget ($)</label>
                <input type="number" placeholder="0.00" className="ct-input" />
              </div>
              <div className="form-field">
                <label>Visibility</label>
                <select className="ct-input">
                  <option value="false">Private</option>
                  <option value="true">Public</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label>Cover Photo URL</label>
                <input type="url" placeholder="https://..." className="ct-input" />
              </div>
            </div>

            <button type="submit" className="ct-submit-btn">
              Create Trip & Build Itinerary →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTrip;
