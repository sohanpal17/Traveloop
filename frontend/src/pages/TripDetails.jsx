import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchTrip, fetchStops } from '../services/api';

const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);

  useEffect(() => {
    const getDetails = async () => {
      try {
        const tripRes = await fetchTrip(id);
        const stopsRes = await fetchStops(id);
        setTrip(tripRes.data.data || tripRes.data);
        setStops(stopsRes.data.data || stopsRes.data || []);
      } catch (err) {
        console.error("Error fetching trip details:", err);
      }
    };
    getDetails();
  }, [id]);

  if (!trip) return <div className="main-content">Loading trip details...</div>;

  return (
    <div className="main-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>{trip.title}</h1>
        <button 
          onClick={() => navigate('/dashboard')}
          style={{ padding: '8px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer' }}
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="content-card">
        <h3>About this Trip</h3>
        <p>{trip.description || "No description provided yet."}</p>
        <p><strong>Dates:</strong> {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}</p>
      </div>

      <div className="content-card" style={{ marginTop: '20px' }}>
        <h3>Itinerary Stops</h3>
        {stops.length > 0 ? (
          stops.map((stop, index) => (
            <div key={index} style={{ padding: '15px', borderBottom: '1px solid #eee' }}>
              <strong>{stop.location_name}</strong>
              <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>Arrival: {stop.arrival_time}</p>
            </div>
          ))
        ) : (
          <p>No stops added to this itinerary yet.</p>
        )}
      </div>
    </div>
  );
};

export default TripDetails;