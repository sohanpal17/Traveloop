import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchTrips } from '../services/api'; // Ensure this matches your api.js
import TripForm from './Trips/TripForm';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to get trips from the database
  const getMyTrips = async () => {
    try {
      setLoading(true);
      const res = await fetchTrips();
      // res.data.data depends on how your backend sends the JSON
      setTrips(res.data.data || []); 
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to load trips.");
    } finally {
      setLoading(false);
    }
  };

  // Run on component mount
  useEffect(() => {
    getMyTrips();
  }, []);

  return (
    <div className="dashboard-wrapper" style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <nav style={{ width: '250px', background: '#1a1a1a', color: 'white', padding: '20px', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ color: '#3498db' }}>Traveloop</h2>
        <ul style={{ listStyle: 'none', padding: 0, marginTop: '40px', flex: 1 }}>
          <li style={{ color: '#3498db', fontWeight: 'bold' }}>🌍 My Trips</li>
        </ul>
        <button onClick={logout} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}>
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '40px', backgroundColor: '#f9f9f9' }}>
        <header style={{ marginBottom: '30px' }}>
          <h1>Welcome, {user?.name || 'Traveler'}!</h1>
          <p>You have {trips.length} upcoming adventures.</p>
        </header>

        {/* Feature: Trip Creator */}
        <section style={{ maxWidth: '500px', marginBottom: '40px' }}>
          <TripForm onTripCreated={getMyTrips} />
        </section>

        {/* Feature: Trip List Display */}
        <section>
          <h2>Your Trips</h2>
          {loading ? (
            <p>Loading your journeys...</p>
          ) : trips.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
              {trips.map(trip => (
                <div key={trip.id} style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ margin: '0 0 10px 0' }}>{trip.title}</h3>
                  <p style={{ color: '#666', fontSize: '14px' }}>
                    {trip.start_date ? new Date(trip.start_date).toLocaleDateString() : 'No date set'}
                  </p>
                  <button style={{ marginTop: '10px', color: '#3498db', border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}>
                    View Details →
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '40px', textAlign: 'center', border: '2px dashed #ccc', borderRadius: '10px', marginTop: '20px' }}>
              <h3>No trips found</h3>
              <p>Start your first journey using the form above!</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;