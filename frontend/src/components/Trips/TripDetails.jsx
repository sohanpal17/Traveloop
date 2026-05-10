import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './TripDetails.css';

const TripDetails = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('itinerary'); // itinerary, notes, expenses, packing, settings
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dummy trip data - will be replaced with API calls
  useEffect(() => {
    setTrip({
      id: tripId,
      title: 'European Summer Backpacking',
      description: 'A 5-city tour across Western Europe',
      start_date: '2026-06-10',
      end_date: '2026-07-15',
      total_budget: 250000,
      is_public: false,
      cover_photo_url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80',
      stops: [
        {
          id: 1,
          city: 'Paris',
          country: 'France',
          start_date: '2026-06-10',
          end_date: '2026-06-15',
          budget: 60000,
          activities: [
            { id: 1, title: 'Eiffel Tower', category: 'sightseeing', estimated_cost: 3750, time: '09:00', date: '2026-06-10' },
            { id: 2, title: 'Louvre Museum', category: 'sightseeing', estimated_cost: 2500, time: '14:00', date: '2026-06-11' }
          ]
        },
        {
          id: 2,
          city: 'Rome',
          country: 'Italy',
          start_date: '2026-06-16',
          end_date: '2026-06-20',
          budget: 55000,
          activities: [
            { id: 3, title: 'Colosseum Tour', category: 'sightseeing', estimated_cost: 4200, time: '10:00', date: '2026-06-16' }
          ]
        }
      ],
      notes: [
        { id: 1, title: 'Important Note', content: 'Remember to book accommodation in advance', note_date: '2026-06-10' },
        { id: 2, title: 'Flight Info', content: 'Flight departs at 6 AM from terminal 2', note_date: '2026-06-10' }
      ],
      expenses: [
        { id: 1, category: 'Transport', description: 'Flight to Paris', amount: 37500, date: '2026-06-01' },
        { id: 2, category: 'Accommodation', description: 'Hotel Paris 3 nights', amount: 25000, date: '2026-06-10' }
      ],
      packing: [
        { id: 1, item_name: 'Passport', category: 'Documents', is_packed: true },
        { id: 2, item_name: 'Camera', category: 'Electronics', is_packed: false },
        { id: 3, item_name: 'Summer Dresses', category: 'Clothing', is_packed: false }
      ]
    });
    setLoading(false);
  }, [tripId]);

  const handleShareTrip = () => {
    toast.info('Trip shared to community!');
    setTrip({ ...trip, is_public: true });
  };

  const totalExpenses = trip?.expenses.reduce((sum, exp) => sum + exp.amount, 0) || 0;
  const packedItems = trip?.packing.filter(item => item.is_packed).length || 0;

  if (loading) {
    return <div className="loading-screen"><div className="spinner-large"></div></div>;
  }

  return (
    <div className="trip-details-shell">
      <div className="trip-details-background"></div>

      <div className="trip-details-card">
        {/* Header */}
        <header className="trip-details-topbar">
          <button 
            className="back-button"
            onClick={() => navigate('/trips')}
          >
            ← Back
          </button>
          <div className="brand-row">
            <span className="brand-mark"></span>
            <span className="brand-name">Traveloop</span>
          </div>
          <button className="profile-badge">U</button>
        </header>

        {/* Trip Header with Cover */}
        <div className="trip-header">
          <div 
            className="trip-header-cover"
            style={{ backgroundImage: `url(${trip.cover_photo_url})` }}
          >
            <div className="trip-header-overlay"></div>
            <div className="trip-header-content">
              <h1>{trip.title}</h1>
              <p>{trip.description}</p>
              <div className="trip-meta">
                <span>📅 {trip.start_date} to {trip.end_date}</span>
                <span>💰 Budget: ₹{trip.total_budget.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="trip-tabs">
          <button 
            className={`tab-button ${activeTab === 'itinerary' ? 'active' : ''}`}
            onClick={() => setActiveTab('itinerary')}
          >
            📍 Itinerary
          </button>
          <button 
            className={`tab-button ${activeTab === 'notes' ? 'active' : ''}`}
            onClick={() => setActiveTab('notes')}
          >
            📝 Notes
          </button>
          <button 
            className={`tab-button ${activeTab === 'expenses' ? 'active' : ''}`}
            onClick={() => setActiveTab('expenses')}
          >
            💳 Expenses (₹{totalExpenses.toLocaleString('en-IN')})
          </button>
          <button 
            className={`tab-button ${activeTab === 'packing' ? 'active' : ''}`}
            onClick={() => setActiveTab('packing')}
          >
            🎒 Packing ({packedItems}/{trip.packing.length})
          </button>
          <button 
            className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ Settings
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          
          {/* Itinerary Tab */}
          {activeTab === 'itinerary' && (
            <div className="itinerary-section">
              <h2>Trip Itinerary</h2>
              {trip.stops.map((stop, idx) => (
                <div key={stop.id} className="stop-card">
                  <div className="stop-header">
                    <h3>{stop.city}, {stop.country}</h3>
                    <p>{stop.start_date} to {stop.end_date}</p>
                  </div>
                  <div className="activities-list">
                    {stop.activities.map(activity => (
                      <div key={activity.id} className="activity-item">
                        <span className="activity-category">{activity.category}</span>
                        <span className="activity-title">{activity.title}</span>
                        <span className="activity-time">{activity.time}</span>
                        <span className="activity-cost">₹{activity.estimated_cost.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                  <button className="btn-edit-btn">Edit Stop</button>
                </div>
              ))}
            </div>
          )}

          {/* Notes Tab */}
          {activeTab === 'notes' && (
            <div className="notes-section">
              <h2>Trip Notes</h2>
              <button className="btn-add">+ Add Note</button>
              <div className="notes-list">
                {trip.notes.map(note => (
                  <div key={note.id} className="note-card">
                    <h3>{note.title}</h3>
                    <p>{note.content}</p>
                    <small>{note.note_date}</small>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Expenses Tab */}
          {activeTab === 'expenses' && (
            <div className="expenses-section">
              <h2>Trip Expenses</h2>
              <button className="btn-add">+ Add Expense</button>
              <div className="summary-row">
                <span>Total Spent:</span>
                <strong>₹{totalExpenses.toLocaleString('en-IN')}</strong>
              </div>
              <div className="expenses-list">
                {trip.expenses.map(expense => (
                  <div key={expense.id} className="expense-row">
                    <div className="expense-info">
                      <strong>{expense.category}</strong>
                      <small>{expense.description}</small>
                      <tiny>{expense.date}</tiny>
                    </div>
                    <span className="expense-amount">₹{expense.amount.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Packing Tab */}
          {activeTab === 'packing' && (
            <div className="packing-section">
              <h2>Packing Checklist</h2>
              <button className="btn-add">+ Add Item</button>
              <div className="packing-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${(packedItems / trip.packing.length) * 100}%` }}></div>
                </div>
                <p>{packedItems} of {trip.packing.length} items packed</p>
              </div>
              <div className="packing-list">
                {trip.packing.map(item => (
                  <div key={item.id} className="packing-item">
                    <input 
                      type="checkbox" 
                      defaultChecked={item.is_packed}
                      onChange={() => {}}
                    />
                    <div className="item-info">
                      <span className="item-name">{item.item_name}</span>
                      <span className="item-category">{item.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="settings-section">
              <h2>Trip Settings</h2>
              <div className="settings-option">
                <label>
                  <input 
                    type="checkbox" 
                    defaultChecked={trip.is_public}
                    onChange={() => {}}
                  />
                  Make this trip public
                </label>
                <small>Share your itinerary with the community</small>
              </div>
              {!trip.is_public && (
                <button 
                  className="btn-primary"
                  onClick={handleShareTrip}
                >
                  Share to Community
                </button>
              )}
              <button className="btn-danger">Delete Trip</button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default TripDetails;
