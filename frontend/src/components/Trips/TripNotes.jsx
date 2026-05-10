import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './TripNotes.css';

const TripNotes = () => {
  const navigate = useNavigate();

  // Toolbar state
  const [searchQuery, setSearchQuery] = useState('');
  const [groupBy, setGroupBy] = useState('Date');
  const [filterBy, setFilterBy] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');

  // Screen specific state
  const [selectedTripId, setSelectedTripId] = useState(1);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'by-day', 'by-stop'

  // Dummy trips for selector
  const trips = [
    { id: 1, title: 'Paris & Rome Adventure' },
    { id: 2, title: 'Tokyo Tech & Culture' },
    { id: 3, title: 'Bali Retreat' }
  ];

  // Dummy notes matching database schema
  // Fields: trip_id, stop_id, title, content, note_date
  const [notes, setNotes] = useState([
    {
      id: 1,
      trip_id: 1,
      stop_id: 1,
      title: 'Hotel check-in details - Rome stop',
      content: 'check in after 2pm, room 302, breakfast included (7-10am)',
      note_date: '2025-06-14',
      day_number: 3,
      stop_name: 'Rome'
    },
    {
      id: 2,
      trip_id: 1,
      stop_id: 2,
      title: 'Train tickets to Florence',
      content: 'Departure at 9:30 AM from Roma Termini. Platform 4. Confirmation code: XYZ123',
      note_date: '2025-06-16',
      day_number: 5,
      stop_name: 'Florence'
    },
    {
      id: 3,
      trip_id: 1,
      stop_id: 1,
      title: 'Colosseum Tour Guide Contact',
      content: 'Meet Marco at the main entrance. Phone: +39 123 456 7890. Bring water and hats.',
      note_date: '2025-06-15',
      day_number: 4,
      stop_name: 'Rome'
    }
  ]);

  const handleDelete = (id) => {
    if (window.confirm('Delete this note?')) {
      setNotes(notes.filter(note => note.id !== id));
    }
  };

  const filteredNotes = useMemo(() => {
    let activeNotes = notes.filter(n => n.trip_id === selectedTripId);

    if (searchQuery) {
      activeNotes = activeNotes.filter(n => 
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        n.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by date as requested in wireframe
    if (sortBy === 'Newest') {
      activeNotes.sort((a, b) => new Date(b.note_date) - new Date(a.note_date));
    } else {
      activeNotes.sort((a, b) => new Date(a.note_date) - new Date(b.note_date));
    }

    return activeNotes;
  }, [notes, selectedTripId, searchQuery, sortBy]);

  return (
    <div className="notes-shell">
      <div className="notes-background"></div>

      <div className="notes-card">
        {/* Top Navbar */}
        <header className="notes-topbar">
          <div className="brand-row" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <span className="brand-mark"></span>
            <span className="brand-name">Traveloop</span>
          </div>
          <button className="profile-badge">U</button>
        </header>

        {/* Toolbar */}
        <div className="notes-toolbar">
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
            <option value="Date">Group by</option>
            <option value="Date">Date</option>
            <option value="Stop">Stop</option>
          </select>

          <select value={filterBy} onChange={(e) => setFilterBy(e.target.value)} className="toolbar-select">
            <option value="All">Filter</option>
            <option value="All">All</option>
            <option value="Important">Important</option>
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="toolbar-select">
            <option value="Newest">Sort by...</option>
            <option value="Newest">Newest</option>
            <option value="Oldest">Oldest</option>
          </select>
        </div>

        {/* Header Section */}
        <div className="notes-header-section">
          <h1 className="notes-main-title">Trip notes</h1>
          
          <div className="trip-selector-row">
            <select 
              value={selectedTripId} 
              onChange={(e) => setSelectedTripId(Number(e.target.value))}
              className="trip-selector"
            >
              {trips.map(trip => (
                <option key={trip.id} value={trip.id}>Trip: {trip.title}</option>
              ))}
            </select>
            
            <button className="action-btn outline add-note-btn" onClick={() => alert('Open add note modal')}>
              + Add Note
            </button>
          </div>

          <div className="notes-tabs">
            <button 
              className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All
            </button>
            <button 
              className={`tab-btn ${activeTab === 'by-day' ? 'active' : ''}`}
              onClick={() => setActiveTab('by-day')}
            >
              by Day
            </button>
            <button 
              className={`tab-btn ${activeTab === 'by-stop' ? 'active' : ''}`}
              onClick={() => setActiveTab('by-stop')}
            >
              by stop
            </button>
          </div>
        </div>

        {/* Notes List */}
        <div className="notes-list-container">
          {filteredNotes.length === 0 ? (
            <p className="no-notes-msg">No notes found for this trip.</p>
          ) : (
            filteredNotes.map(note => {
              // Format date properly like "June 14 2025"
              const dateObj = new Date(note.note_date);
              const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
              
              return (
                <div key={note.id} className="note-item-card">
                  <div className="note-item-content">
                    <h3>{note.title}</h3>
                    <p>{note.content}</p>
                    <span className="note-timestamp">Day {note.day_number}: {formattedDate}</span>
                  </div>
                  <div className="note-item-actions">
                    <button className="icon-btn edit" title="Edit" onClick={() => alert('Edit note')}>
                      ✎
                    </button>
                    <button className="icon-btn delete" title="Delete" onClick={() => handleDelete(note.id)}>
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};

export default TripNotes;
