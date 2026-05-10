import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchTrips, fetchChecklist, fetchActivities, addChecklistItem, toggleChecklistItem } from '../services/api';
import TripForm from './Trips/TripForm';
import Budget from '../pages/Budget';
import PackingList from '../pages/PackingList';

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [activeView, setActiveView] = useState('trips');
  const [checklist, setChecklist] = useState([]);
  const [activities, setActivities] = useState([]);

  const loadDashboardData = useCallback(async () => {
    try {
      const res = await fetchTrips();
      const tripData = res.data.data || res.data.trips || [];
      setTrips(tripData);

      if (tripData.length > 0 && tripData[0].id) {
        const activeTripId = tripData[0].id;
        const [checkRes, actRes] = await Promise.all([
          fetchChecklist(activeTripId),
          fetchActivities(activeTripId)
        ]);
        setChecklist(checkRes.data.items || checkRes.data.data || []);
        setActivities(actRes.data.activities || actRes.data.data || []);
      }
    } catch (err) {
      console.error("Dashboard Load Error:", err.message);
    }
  }, []);

  useEffect(() => { loadDashboardData(); }, [loadDashboardData]);

  const handleAddChecklist = async (e) => {
    e.preventDefault();
    const itemName = e.target.item.value;
    if (trips[0] && itemName) {
      await addChecklistItem(trips[0].id, { item_name: itemName });
      e.target.reset();
      loadDashboardData();
    }
  };

  const handleToggleChecklist = async (itemId, currentStatus) => {
    if (trips[0]) {
      try {
        await toggleChecklistItem(trips[0].id, itemId, { is_packed: !currentStatus });
        loadDashboardData();
      } catch (err) {
        console.error("Toggle failed", err);
      }
    }
  };

  return (
    <div className="dashboard-wrapper">
      <nav className="sidebar">
        <h2>Traveloop</h2>
        <div className={`nav-item ${activeView === 'trips' ? 'active' : ''}`} onClick={() => setActiveView('trips')}>🌍 My Trips</div>
        <div className={`nav-item ${activeView === 'budget' ? 'active' : ''}`} onClick={() => setActiveView('budget')}>📊 Budget Tracker</div>
        <div className={`nav-item ${activeView === 'checklist' ? 'active' : ''}`} onClick={() => setActiveView('checklist')}>✅ Packing Checklist</div>
        <div className="nav-item" onClick={() => navigate('/explore')}>🔭 Explore</div>
        <div className="nav-item" onClick={() => navigate('/profile')}>👤 Profile</div>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </nav>

      <main className="main-content">
        <h1>{activeView === 'trips' ? 'Your Adventures' : activeView === 'budget' ? 'Budget' : 'Packing'}</h1>
        
        {activeView === 'trips' && (
          <div>
            <div className="content-card" style={{maxWidth: '500px', marginBottom: '30px'}}>
               <TripForm onTripCreated={loadDashboardData} />
            </div>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px'}}>
              {trips.map(trip => (
                <div key={trip.id} className="content-card" onClick={() => navigate(`/trip/${trip.id}`)} style={{cursor: 'pointer'}}>
                  <h3 style={{textTransform: 'capitalize'}}>{trip.title}</h3>
                  <p>{trip.start_date ? new Date(trip.start_date).toLocaleDateString() : 'Plan dates'}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeView === 'budget' && <Budget activities={activities} />}
        
        {activeView === 'checklist' && (
          <PackingList 
            checklist={checklist} 
            onAdd={handleAddChecklist} 
            onToggle={handleToggleChecklist} 
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard;