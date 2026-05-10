import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ItineraryBuilder.css';

/**
 * ItineraryBuilder — Build the day-wise trip plan.
 *
 * Backend schema reference:
 *   stops: { trip_id, city, country, start_date, end_date, duration_days, notes, order_index, latitude, longitude }
 *   activities: { stop_id, title, description, category, estimated_cost, actual_cost, date, time, duration_minutes, location, booking_url, is_completed }
 */
const ItineraryBuilder = () => {
  const navigate = useNavigate();
  const [tripTitle, setTripTitle] = useState('');

  const makeStop = () => ({
    id: Date.now().toString(),
    city: '',
    country: '',
    start_date: '',
    end_date: '',
    notes: '',
    order_index: 0,
    activities: [{ title: '', category: 'sightseeing', estimated_cost: '' }]
  });

  const [stops, setStops] = useState([makeStop()]);

  const handleAddStop = () => {
    setStops([...stops, { ...makeStop(), id: Date.now().toString(), order_index: stops.length }]);
  };

  const handleRemoveStop = (id) => {
    if (stops.length === 1) return;
    setStops(stops.filter(s => s.id !== id));
  };

  const handleStopChange = (id, field, value) => {
    setStops(stops.map(s => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const handleMoveStop = (index, direction) => {
    if ((direction === -1 && index === 0) || (direction === 1 && index === stops.length - 1)) return;
    const arr = [...stops];
    [arr[index], arr[index + direction]] = [arr[index + direction], arr[index]];
    setStops(arr);
  };

  const handleAddActivity = (stopId) => {
    setStops(stops.map(s =>
      s.id === stopId
        ? { ...s, activities: [...s.activities, { title: '', category: 'sightseeing', estimated_cost: '' }] }
        : s
    ));
  };

  const handleActivityChange = (stopId, actIndex, field, value) => {
    setStops(stops.map(s => {
      if (s.id === stopId) {
        const acts = [...s.activities];
        acts[actIndex] = { ...acts[actIndex], [field]: value };
        return { ...s, activities: acts };
      }
      return s;
    }));
  };

  const handleRemoveActivity = (stopId, actIndex) => {
    setStops(stops.map(s => {
      if (s.id === stopId) {
        return { ...s, activities: s.activities.filter((_, i) => i !== actIndex) };
      }
      return s;
    }));
  };

  const handleSave = () => {
    if (!tripTitle.trim()) {
      alert('Please enter a trip name.');
      return;
    }
    // TODO: POST to backend /api/trips then /api/stops then /api/activities
    navigate('/trips');
  };

  const categories = ['sightseeing', 'food', 'transport', 'accommodation', 'shopping', 'entertainment', 'other'];

  return (
    <div className="itinerary-container">
      <div className="itinerary-background"></div>

      <div className="itinerary-content">
        <header className="itinerary-header">
          <h1>Plan Your Itinerary</h1>
          <input
            type="text"
            className="trip-name-input"
            placeholder="e.g., Summer in Europe 2026"
            value={tripTitle}
            onChange={(e) => setTripTitle(e.target.value)}
          />
        </header>

        <div className="stops-list">
          {stops.map((stop, index) => (
            <div key={stop.id} className="stop-card">
              <div className="stop-header">
                <div className="stop-inputs">
                  <div className="input-group">
                    <label>City</label>
                    <input
                      type="text"
                      className="itinerary-input"
                      placeholder="e.g., Paris"
                      value={stop.city}
                      onChange={(e) => handleStopChange(stop.id, 'city', e.target.value)}
                    />
                  </div>
                  <div className="input-group">
                    <label>Country</label>
                    <input
                      type="text"
                      className="itinerary-input"
                      placeholder="e.g., France"
                      value={stop.country}
                      onChange={(e) => handleStopChange(stop.id, 'country', e.target.value)}
                    />
                  </div>
                  <div className="input-group">
                    <label>Start Date</label>
                    <input
                      type="date"
                      className="itinerary-input"
                      value={stop.start_date}
                      onChange={(e) => handleStopChange(stop.id, 'start_date', e.target.value)}
                    />
                  </div>
                  <div className="input-group">
                    <label>End Date</label>
                    <input
                      type="date"
                      className="itinerary-input"
                      value={stop.end_date}
                      onChange={(e) => handleStopChange(stop.id, 'end_date', e.target.value)}
                    />
                  </div>
                </div>

                <div className="stop-controls">
                  <button className="icon-btn" disabled={index === 0} onClick={() => handleMoveStop(index, -1)} title="Move Up">↑</button>
                  <button className="icon-btn" disabled={index === stops.length - 1} onClick={() => handleMoveStop(index, 1)} title="Move Down">↓</button>
                  <button className="icon-btn delete" disabled={stops.length === 1} onClick={() => handleRemoveStop(stop.id)} title="Remove Stop">×</button>
                </div>
              </div>

              {/* Notes for this stop */}
              <div className="input-group" style={{ marginTop: '12px' }}>
                <label>Notes</label>
                <input
                  type="text"
                  className="itinerary-input"
                  placeholder="Any notes for this stop..."
                  value={stop.notes}
                  onChange={(e) => handleStopChange(stop.id, 'notes', e.target.value)}
                />
              </div>

              {/* Activities */}
              <div className="activities-section">
                <h4>Activities & Plans</h4>
                {stop.activities.map((activity, actIndex) => (
                  <div key={actIndex} className="activity-item">
                    <input
                      type="text"
                      className="itinerary-input"
                      placeholder="Activity title (e.g., Visit Eiffel Tower)"
                      value={activity.title}
                      onChange={(e) => handleActivityChange(stop.id, actIndex, 'title', e.target.value)}
                      style={{ flex: 2 }}
                    />
                    <select
                      className="itinerary-input"
                      value={activity.category}
                      onChange={(e) => handleActivityChange(stop.id, actIndex, 'category', e.target.value)}
                      style={{ flex: 1, minWidth: '120px' }}
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      className="itinerary-input"
                      placeholder="Cost ($)"
                      value={activity.estimated_cost}
                      onChange={(e) => handleActivityChange(stop.id, actIndex, 'estimated_cost', e.target.value)}
                      style={{ flex: 0.7, minWidth: '90px' }}
                    />
                    <button
                      className="icon-btn delete"
                      onClick={() => handleRemoveActivity(stop.id, actIndex)}
                      disabled={stop.activities.length === 1 && !activity.title}
                      title="Remove Activity"
                    >×</button>
                  </div>
                ))}
                <button className="add-activity-btn" onClick={() => handleAddActivity(stop.id)}>
                  + Add Activity
                </button>
              </div>
            </div>
          ))}
        </div>

        <button className="btn-add-stop" onClick={handleAddStop}>
          + Add Another Stop
        </button>

        <button className="btn-save-itinerary" onClick={handleSave}>
          Save Itinerary
        </button>
      </div>
    </div>
  );
};

export default ItineraryBuilder;
