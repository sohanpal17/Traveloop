import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './SharedItinerary.css';

const SharedItinerary = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Dummy data structured according to database schema (trips, stops, activities)
  const sharedTrip = {
    title: 'Summer in Europe 2026',
    creator: 'Alex Wanderer',
    cover_photo: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=80',
    total_estimated_cost: 125000,
    days: 7,
    stops: 3
  };

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
    <div className="shared-shell">
      <div className="shared-background"></div>

      <div className="shared-card">
        {/* Top Navbar */}
        <header className="shared-topbar">
          <div className="brand-row" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <span className="brand-mark"></span>
            <span className="brand-name">Traveloop</span>
          </div>
          <button className="plan-fab" onClick={() => navigate('/login')}>
            Sign up to copy
          </button>
        </header>

        {/* Public Summary Banner */}
        <div className="public-summary-banner" style={{ backgroundImage: `url(${sharedTrip.cover_photo})` }}>
          <div className="banner-overlay"></div>
          <div className="banner-content">
            <h1 className="banner-title">{sharedTrip.title}</h1>
            <p className="banner-creator">Curated by {sharedTrip.creator}</p>
            
            <div className="trip-stats">
              <div className="stat-item">
                <span className="stat-value">{sharedTrip.days}</span>
                <span className="stat-label">Days</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{sharedTrip.stops}</span>
                <span className="stat-label">Cities</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">₹{sharedTrip.total_estimated_cost.toLocaleString('en-IN')}</span>
                <span className="stat-label">Estimated</span>
              </div>
            </div>

            <div className="banner-actions">
              <button className="plan-fab">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                Copy Trip
              </button>
              <button className="plan-fab" style={{ background: 'transparent', color: '#fff', borderColor: '#fff' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Timeline Layout */}
        <div className="shared-timeline-wrapper">
          <div className="section-heading" style={{ justifyContent: 'center', marginTop: '40px', marginBottom: '40px' }}>
            <h2 className="shared-main-title">Itinerary Details</h2>
          </div>

          <div className="shared-headers">
            <div className="header-activity">Physical Activity</div>
            <div className="header-expense">Expense</div>
          </div>

          <div className="timeline-container">
            {itineraryData.map((dayData, dayIndex) => (
              <div key={dayIndex} className="timeline-day-group">
                
                <div className="day-chip-container">
                  <div className="day-chip">Day {dayData.day}</div>
                </div>

                <div className="day-activities">
                  {dayData.activities.map((activity, actIndex) => (
                    <div key={activity.id} className="activity-row">
                      
                      <div className="activity-card">
                        <h3>{activity.title}</h3>
                        <p>{activity.time}</p>
                      </div>

                      {actIndex < dayData.activities.length - 1 && (
                        <div className="timeline-arrow">↓</div>
                      )}

                      <div className="expense-card">
                        <h3>₹{activity.estimated_cost.toLocaleString('en-IN')}</h3>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedItinerary;
