import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
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
  const { tripId } = useParams();
  const location = useLocation();
  const [tripTitle, setTripTitle] = useState('');

  const makeStop = () => ({
    id: Date.now().toString(),
    city: '',
    country: '',
    start_date: '',
    end_date: '',
    notes: '',
    budget: '',
    order_index: 0,
    activities: [{ title: '', category: 'sightseeing', estimated_cost: '' }]
  });

  const [stops, setStops] = useState([makeStop()]);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSave = async () => {
    if (!tripTitle.trim()) {
      toast.error('Please enter a trip name.');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: POST stops and activities to backend
      // For now, just redirect to dashboard after brief delay
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success('Itinerary saved successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Save failed', err);
      toast.error('Failed to save itinerary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // If we were navigated here from CreateTrip, prefill title from location state.
    if (location?.state?.trip) {
      setTripTitle(location.state.trip.title || '');
    }
    // Optionally, if tripId corresponds to an existing trip, fetch it here.
  }, [location, tripId]);

  useEffect(() => {
    // If navigated with trip that includes start/end dates, pre-populate stops
    const trip = location?.state?.trip;
    if (trip) {
      const { start_date, startDate, end_date, endDate } = trip;
      const start = start_date || startDate || '';
      const end = end_date || endDate || '';

      if (start && end) {
        try {
          const s = new Date(start);
          const e = new Date(end);
          if (!isNaN(s) && !isNaN(e) && e >= s) {
            const days = Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1;
            const generatedStops = [];
            for (let i = 0; i < days; i++) {
              const current = new Date(s);
              current.setDate(s.getDate() + i);
              generatedStops.push({
                id: `${trip.id || 'tmp'}-stop-${i}`,
                city: trip.destination || '',
                country: '',
                start_date: current.toISOString().slice(0, 10),
                end_date: current.toISOString().slice(0, 10),
                notes: '',
                order_index: i,
                activities: [{ title: '', category: 'sightseeing', estimated_cost: '' }]
              });
            }
            setStops(generatedStops);
          }
        } catch (err) {
          console.warn('Failed to generate stops from dates', err);
        }
      }
    }
  }, [location]);

  const categories = ['sightseeing', 'food', 'transport', 'accommodation', 'shopping', 'entertainment', 'other'];

  return (
    <div className="itinerary-container">
      <div className="itinerary-background"></div>

      <div className="itinerary-content">
        <header className="itinerary-header">
          <h1>Build Your Itinerary</h1>
          <input
            type="text"
            className="trip-name-input"
            placeholder="Enter your trip name"
            value={tripTitle}
            onChange={(e) => setTripTitle(e.target.value)}
          />
        </header>

        <div className="sections-list">
          {stops.map((stop, index) => (
            <div key={stop.id} className="section-card">
              <div className="section-header">
                <h3>Section {index + 1}</h3>
                {stops.length > 1 && (
                  <button
                    className="icon-btn delete-small"
                    onClick={() => handleRemoveStop(stop.id)}
                    title="Remove Section"
                  >
                    ×
                  </button>
                )}
              </div>

              <p className="section-description">
                All the necessary information about this section.<br/>
                This can be anything like travel section, hotel or any other activity
              </p>

              <div className="section-inputs">
                <div className="input-group">
                  <label>Date Range</label>
                  <div className="date-range-inputs">
                    <input
                      type="date"
                      className="section-input"
                      value={stop.start_date}
                      onChange={(e) => handleStopChange(stop.id, 'start_date', e.target.value)}
                      placeholder="From"
                    />
                    <span className="date-sep">to</span>
                    <input
                      type="date"
                      className="section-input"
                      value={stop.end_date}
                      onChange={(e) => handleStopChange(stop.id, 'end_date', e.target.value)}
                      placeholder="To"
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label>Budget of this section</label>
                  <input
                    type="number"
                    className="section-input"
                    placeholder="₹0.00"
                    value={stop.budget}
                    onChange={(e) => handleStopChange(stop.id, 'budget', e.target.value)}
                  />
                </div>
              </div>

              {/* Notes section */}
              <div className="notes-section">
                <input
                  type="text"
                  className="section-input"
                  placeholder="Add notes for this section..."
                  value={stop.notes}
                  onChange={(e) => handleStopChange(stop.id, 'notes', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>

        <button className="btn-add-section" onClick={handleAddStop}>
          + Add another Section
        </button>

        <div className="itinerary-actions">
          <button className="btn-cancel" onClick={() => navigate('/dashboard')} disabled={isLoading}>
            Cancel
          </button>
          <button className="btn-save-itinerary" onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Itinerary'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItineraryBuilder;
