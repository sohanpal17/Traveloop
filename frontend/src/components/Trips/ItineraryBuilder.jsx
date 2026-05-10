import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ItineraryBuilder.css';

const ItineraryBuilder = () => {
  const navigate = useNavigate();
  const [tripName, setTripName] = useState('');
  
  const [stops, setStops] = useState([
    {
      id: Date.now().toString(),
      city: '',
      startDate: '',
      endDate: '',
      activities: ['']
    }
  ]);

  const handleAddStop = () => {
    setStops([
      ...stops,
      {
        id: Date.now().toString(),
        city: '',
        startDate: '',
        endDate: '',
        activities: ['']
      }
    ]);
  };

  const handleRemoveStop = (id) => {
    if (stops.length === 1) return; // Keep at least one stop
    setStops(stops.filter(stop => stop.id !== id));
  };

  const handleStopChange = (id, field, value) => {
    setStops(stops.map(stop => 
      stop.id === id ? { ...stop, [field]: value } : stop
    ));
  };

  const handleMoveStop = (index, direction) => {
    if ((direction === -1 && index === 0) || (direction === 1 && index === stops.length - 1)) return;
    
    const newStops = [...stops];
    const temp = newStops[index];
    newStops[index] = newStops[index + direction];
    newStops[index + direction] = temp;
    
    setStops(newStops);
  };

  const handleAddActivity = (stopId) => {
    setStops(stops.map(stop => 
      stop.id === stopId 
        ? { ...stop, activities: [...stop.activities, ''] }
        : stop
    ));
  };

  const handleActivityChange = (stopId, activityIndex, value) => {
    setStops(stops.map(stop => {
      if (stop.id === stopId) {
        const newActivities = [...stop.activities];
        newActivities[activityIndex] = value;
        return { ...stop, activities: newActivities };
      }
      return stop;
    }));
  };

  const handleRemoveActivity = (stopId, activityIndex) => {
    setStops(stops.map(stop => {
      if (stop.id === stopId) {
        const newActivities = stop.activities.filter((_, idx) => idx !== activityIndex);
        return { ...stop, activities: newActivities };
      }
      return stop;
    }));
  };

  const handleSave = () => {
    if (!tripName.trim()) {
      alert("Please enter a trip name.");
      return;
    }
    // Logic to save itinerary would go here
    navigate('/trips');
  };

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
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
          />
        </header>

        <div className="stops-list">
          {stops.map((stop, index) => (
            <div key={stop.id} className="stop-card">
              <div className="stop-header">
                <div className="stop-inputs">
                  <div className="input-group">
                    <label>City / Location</label>
                    <input 
                      type="text" 
                      className="itinerary-input" 
                      placeholder="e.g., Paris"
                      value={stop.city}
                      onChange={(e) => handleStopChange(stop.id, 'city', e.target.value)}
                    />
                  </div>
                  <div className="input-group">
                    <label>Start Date</label>
                    <input 
                      type="date" 
                      className="itinerary-input"
                      value={stop.startDate}
                      onChange={(e) => handleStopChange(stop.id, 'startDate', e.target.value)}
                    />
                  </div>
                  <div className="input-group">
                    <label>End Date</label>
                    <input 
                      type="date" 
                      className="itinerary-input"
                      value={stop.endDate}
                      onChange={(e) => handleStopChange(stop.id, 'endDate', e.target.value)}
                    />
                  </div>
                </div>

                <div className="stop-controls">
                  <button 
                    className="icon-btn" 
                    disabled={index === 0}
                    onClick={() => handleMoveStop(index, -1)}
                    title="Move Up"
                  >
                    ↑
                  </button>
                  <button 
                    className="icon-btn" 
                    disabled={index === stops.length - 1}
                    onClick={() => handleMoveStop(index, 1)}
                    title="Move Down"
                  >
                    ↓
                  </button>
                  <button 
                    className="icon-btn delete" 
                    disabled={stops.length === 1}
                    onClick={() => handleRemoveStop(stop.id)}
                    title="Remove Stop"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="activities-section">
                <h4>Activities & Plans</h4>
                {stop.activities.map((activity, actIndex) => (
                  <div key={actIndex} className="activity-item">
                    <input 
                      type="text" 
                      className="itinerary-input" 
                      placeholder="e.g., Visit the Eiffel Tower, Dinner at local bistro"
                      value={activity}
                      onChange={(e) => handleActivityChange(stop.id, actIndex, e.target.value)}
                    />
                    <button 
                      className="icon-btn delete" 
                      onClick={() => handleRemoveActivity(stop.id, actIndex)}
                      disabled={stop.activities.length === 1 && !activity}
                      title="Remove Activity"
                    >
                      ×
                    </button>
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
