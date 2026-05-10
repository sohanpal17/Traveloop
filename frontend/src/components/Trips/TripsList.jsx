import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './TripsList.css';

const TripsList = () => {
  const navigate = useNavigate();

  // Toolbar state
  const [searchQuery, setSearchQuery] = useState('');
  const [groupBy, setGroupBy] = useState('Status');
  const [filterBy, setFilterBy] = useState('All');
  const [sortBy, setSortBy] = useState('Date');

  // Dummy data mapping to tripModel.js schema
  // Schema: id, title, description, start_date, end_date, cover_photo_url, etc.
  const allTrips = [
    {
      id: 1,
      title: 'European Summer Backpacking',
      description: 'A 5-city tour across Western Europe focusing on history and food.',
      start_date: '2026-06-10',
      end_date: '2026-07-15',
      cover_photo_url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80',
      status: 'upcoming'
    },
    {
      id: 2,
      title: 'Tokyo Tech & Culture',
      description: 'Exploring the busy streets of Tokyo and historic temples of Kyoto.',
      start_date: '2026-10-05',
      end_date: '2026-10-19',
      cover_photo_url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80',
      status: 'ongoing'
    },
    {
      id: 3,
      title: 'Bali Retreat',
      description: 'Relaxing 10 days in Bali with yoga, beaches, and surfing.',
      start_date: '2025-01-12',
      end_date: '2025-01-22',
      cover_photo_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
      status: 'completed'
    },
    {
      id: 4,
      title: 'Rome Getaway',
      description: 'Weekend trip to Rome to see the Colosseum and eat pasta.',
      start_date: '2024-05-10',
      end_date: '2024-05-14',
      cover_photo_url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
      status: 'completed'
    }
  ];

  const filteredTrips = useMemo(() => {
    return allTrips.filter(trip => 
      trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allTrips]);

  const ongoingTrips = filteredTrips.filter(t => t.status === 'ongoing');
  const upcomingTrips = filteredTrips.filter(t => t.status === 'upcoming');
  const completedTrips = filteredTrips.filter(t => t.status === 'completed');

  const TripCard = ({ trip }) => (
    <div className="trip-list-card">
      <div className="trip-list-card__image" style={{ backgroundImage: `url(${trip.cover_photo_url})` }}></div>
      <div className="trip-list-card__content">
        <div className="trip-list-card__info">
          <h3>{trip.title}</h3>
          <p>{trip.description}</p>
          <span className="trip-dates">{trip.start_date} to {trip.end_date}</span>
        </div>
        <div className="trip-list-card__actions">
          <button className="plan-fab" onClick={() => navigate(`/trips/${trip.id}`)}>
            View
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="trips-shell">
      <div className="trips-background"></div>

      <div className="trips-card">
        {/* Top Navbar */}
        <header className="trips-topbar">
          <div className="brand-row" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
            <span className="brand-mark"></span>
            <span className="brand-name">Traveloop</span>
          </div>
          <div className="topbar-actions">
            <button className="topbar-link" onClick={() => navigate('/profile')}>My Profile</button>
            <button className="profile-badge">U</button>
          </div>
        </header>

        {/* Toolbar */}
        <div className="trips-toolbar">
          <label className="search-input" aria-label="Search">
            <span className="search-icon" aria-hidden="true">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search trips ......"
            />
          </label>

          <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)} className="toolbar-select">
            <option value="Status">Group by</option>
            <option value="Status">Status</option>
            <option value="Year">Year</option>
          </select>

          <select value={filterBy} onChange={(e) => setFilterBy(e.target.value)} className="toolbar-select">
            <option value="All">Filter</option>
            <option value="All">All</option>
            <option value="Public">Public</option>
            <option value="Private">Private</option>
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="toolbar-select">
            <option value="Date">Sort by...</option>
            <option value="Date">Date</option>
            <option value="Name">Name</option>
          </select>
        </div>

        {/* Trip Sections */}
        <div className="trips-sections-wrapper">
          
          {ongoingTrips.length > 0 && (
            <section className="trip-category-section">
              <h2 className="trip-category-title">Ongoing</h2>
              <div className="trip-category-list">
                {ongoingTrips.map(trip => <TripCard key={trip.id} trip={trip} />)}
              </div>
            </section>
          )}

          {upcomingTrips.length > 0 && (
            <section className="trip-category-section">
              <h2 className="trip-category-title">Up-coming</h2>
              <div className="trip-category-list">
                {upcomingTrips.map(trip => <TripCard key={trip.id} trip={trip} />)}
              </div>
            </section>
          )}

          {completedTrips.length > 0 && (
            <section className="trip-category-section">
              <h2 className="trip-category-title">Completed</h2>
              <div className="trip-category-slider">
                {/* Simulated left arrow from wireframe */}
                <button className="slider-arrow">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                
                <div className="slider-content">
                  {completedTrips.map(trip => <TripCard key={trip.id} trip={trip} />)}
                </div>
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
};

export default TripsList;
