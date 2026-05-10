import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ItineraryView.css';

const ItineraryView = () => {
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [groupBy, setGroupBy] = useState('Day');
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Time');

  // Dummy data structured according to database schema (stops and activities)
  const itineraryData = [
    {
      day: 1,
      date: '2026-06-15',
      activities: [
        { id: 1, title: 'Morning City Tour', category: 'sightseeing', estimated_cost: 45, time: '09:00 AM' },
        { id: 2, title: 'Lunch at Local Cafe', category: 'food', estimated_cost: 25, time: '01:00 PM' },
        { id: 3, title: 'Museum Visit', category: 'sightseeing', estimated_cost: 30, time: '03:00 PM' }
      ]
    },
    {
      day: 2,
      date: '2026-06-16',
      activities: [
        { id: 4, title: 'Hiking Trail', category: 'sightseeing', estimated_cost: 0, time: '08:00 AM' },
        { id: 5, title: 'Dinner with view', category: 'food', estimated_cost: 60, time: '07:00 PM' }
      ]
    }
  ];

  return (
    <div className="itinerary-shell">
      <div className="itinerary-background"></div>
      
      <div className="itinerary-card">
        {/* Top Navbar matched from wireframe & Dashboard theme */}
        <header className="itinerary-topbar">
          <div className="brand-row" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <span className="brand-mark"></span>
            <span className="brand-name">Traveloop</span>
          </div>
          <button className="profile-badge">U</button>
        </header>

        {/* Controls Bar / Toolbar */}
        <div className="itinerary-toolbar">
          <label className="search-input" aria-label="Search">
            <span className="search-icon" aria-hidden="true">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search bar ......"
            />
          </label>

          <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)} className="toolbar-select">
            <option value="Day">Group by</option>
            <option value="Day">Day</option>
            <option value="City">City</option>
          </select>

          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="toolbar-select">
            <option value="All">Filter</option>
            <option value="All">All</option>
            <option value="Sightseeing">Sightseeing</option>
            <option value="Food">Food</option>
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="toolbar-select">
            <option value="Time">Sort by...</option>
            <option value="Time">Time</option>
            <option value="Cost">Cost</option>
          </select>
        </div>

        {/* Title */}
        <div className="section-heading" style={{ justifyContent: 'center', marginTop: '30px', marginBottom: '40px' }}>
          <h1 className="itinerary-main-title">Itinerary for a selected place</h1>
        </div>

        {/* Header Row */}
        <div className="itinerary-headers">
          <div className="header-activity">Physical Activity</div>
          <div className="header-expense">Expense</div>
        </div>

        {/* Timeline Layout */}
        <div className="timeline-container">
          {itineraryData.map((dayData, dayIndex) => (
            <div key={dayIndex} className="timeline-day-group">
              
              {/* Day Chip on the left */}
              <div className="day-chip-container">
                <div className="day-chip">Day {dayData.day}</div>
              </div>

              <div className="day-activities">
                {dayData.activities.map((activity, actIndex) => (
                  <div key={activity.id} className="activity-row">
                    
                    {/* Activity Card */}
                    <div className="activity-card">
                      <h3>{activity.title}</h3>
                      <p>{activity.time}</p>
                    </div>

                    {/* Connecting Arrow */}
                    {actIndex < dayData.activities.length - 1 && (
                      <div className="timeline-arrow">↓</div>
                    )}

                    {/* Expense Card */}
                    <div className="expense-card">
                      <h3>${activity.estimated_cost}</h3>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ItineraryView;
