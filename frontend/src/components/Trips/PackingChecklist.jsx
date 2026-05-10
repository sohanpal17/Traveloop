import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './PackingChecklist.css';

const PackingChecklist = () => {
  const navigate = useNavigate();

  // View state
  const [searchQuery, setSearchQuery] = useState('');
  const [groupBy, setGroupBy] = useState('Category');
  const [filterBy, setFilterBy] = useState('All');
  const [sortBy, setSortBy] = useState('Priority');
  const [selectedTripId, setSelectedTripId] = useState(1);

  // Dummy trips for selector
  const trips = [
    { id: 1, title: 'Paris & Rome Adventure' },
    { id: 2, title: 'Bali Reset Retreat' },
    { id: 3, title: 'Tokyo City Break' }
  ];

  // Dummy packing items based on database schema
  const [packingItems, setPackingItems] = useState([
    { id: 1, trip_id: 1, item_name: 'Passport', category: 'Documents', is_packed: true },
    { id: 2, trip_id: 1, item_name: 'Flight Tickets (printed)', category: 'Documents', is_packed: true },
    { id: 3, trip_id: 1, item_name: 'Travel insurance', category: 'Documents', is_packed: true },
    { id: 4, trip_id: 1, item_name: 'Hotel booking confirmation', category: 'Documents', is_packed: false },
    { id: 5, trip_id: 1, item_name: 'Casual Shirts', category: 'Clothing', is_packed: true },
    { id: 6, trip_id: 1, item_name: 'Trousers / jeans', category: 'Clothing', is_packed: false },
    { id: 7, trip_id: 1, item_name: 'Comfortable walking shoes', category: 'Clothing', is_packed: false },
    { id: 8, trip_id: 1, item_name: 'Light jacket / windbreaker', category: 'Clothing', is_packed: false },
    { id: 9, trip_id: 1, item_name: 'Phone charger', category: 'Electronics', is_packed: true },
    { id: 10, trip_id: 1, item_name: 'Universal power adapter', category: 'Electronics', is_packed: false },
    { id: 11, trip_id: 1, item_name: 'Earphone / headphones', category: 'Electronics', is_packed: false }
  ]);

  const handleToggle = (id) => {
    setPackingItems(items =>
      items.map(item =>
        item.id === id ? { ...item, is_packed: !item.is_packed } : item
      )
    );
  };

  const handleResetAll = () => {
    setPackingItems(items =>
      items.map(item => ({ ...item, is_packed: false }))
    );
  };

  const handleAddItem = () => {
    const newItem = {
      id: Date.now(),
      trip_id: selectedTripId,
      item_name: 'New Custom Item',
      category: 'Other',
      is_packed: false
    };
    setPackingItems([...packingItems, newItem]);
  };

  // Group items by category
  const categorizedItems = useMemo(() => {
    const activeItems = packingItems.filter(item => item.trip_id === selectedTripId);
    
    // Applying search filter
    const searchFiltered = activeItems.filter(item => 
      item.item_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const grouped = searchFiltered.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {});

    return grouped;
  }, [packingItems, selectedTripId, searchQuery]);

  // Progress stats
  const activeItems = packingItems.filter(item => item.trip_id === selectedTripId);
  const totalItemsCount = activeItems.length;
  const packedItemsCount = activeItems.filter(item => item.is_packed).length;
  const progressPercent = totalItemsCount === 0 ? 0 : Math.round((packedItemsCount / totalItemsCount) * 100);

  return (
    <div className="checklist-shell">
      <div className="checklist-background"></div>

      <div className="checklist-card">
        {/* Top Navbar */}
        <header className="checklist-topbar">
          <div className="brand-row" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <span className="brand-mark"></span>
            <span className="brand-name">Traveloop</span>
          </div>
          <button className="profile-badge">U</button>
        </header>

        {/* Controls Bar / Toolbar */}
        <div className="checklist-toolbar">
          <label className="search-input" aria-label="Search">
            <span className="search-icon" aria-hidden="true">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items ......"
            />
          </label>

          <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)} className="toolbar-select">
            <option value="Category">Group by</option>
            <option value="Category">Category</option>
            <option value="Status">Status</option>
          </select>

          <select value={filterBy} onChange={(e) => setFilterBy(e.target.value)} className="toolbar-select">
            <option value="All">Filter</option>
            <option value="All">All</option>
            <option value="Packed">Packed</option>
            <option value="Unpacked">Unpacked</option>
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="toolbar-select">
            <option value="Priority">Sort by...</option>
            <option value="Priority">Priority</option>
            <option value="Name">Name</option>
          </select>
        </div>

        {/* Header Section */}
        <div className="checklist-header-section">
          <h1 className="checklist-main-title">Packing checklist</h1>
          
          <div className="trip-selector-container">
            <select 
              value={selectedTripId} 
              onChange={(e) => setSelectedTripId(Number(e.target.value))}
              className="trip-selector"
            >
              {trips.map(trip => (
                <option key={trip.id} value={trip.id}>Trip: {trip.title}</option>
              ))}
            </select>
          </div>

          <div className="progress-section">
            <p className="progress-text">Progress: {packedItemsCount}/{totalItemsCount} items packed</p>
            <div className="progress-bar-container">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Categories List */}
        <div className="categories-container">
          {Object.entries(categorizedItems).map(([categoryName, items]) => {
            const packedInCategory = items.filter(item => item.is_packed).length;
            
            return (
              <div key={categoryName} className="category-section">
                <div className="category-header">
                  <h2>{categoryName}</h2>
                  <span className="category-count">{packedInCategory}/{items.length}</span>
                </div>
                
                <div className="items-list">
                  {items.map(item => (
                    <label key={item.id} className="item-row">
                      <div className={`checkbox-custom ${item.is_packed ? 'checked' : ''}`}>
                        {item.is_packed && <span className="checkmark">✓</span>}
                      </div>
                      <input 
                        type="checkbox" 
                        className="hidden-checkbox"
                        checked={item.is_packed}
                        onChange={() => handleToggle(item.id)}
                      />
                      <span className={`item-name ${item.is_packed ? 'item-packed' : ''}`}>
                        {item.item_name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="checklist-actions">
          <button className="action-btn outline" onClick={handleAddItem}>
            + add item to checklist
          </button>
          <button className="action-btn outline" onClick={handleResetAll}>
            Reset all
          </button>
          <button className="action-btn outline" onClick={() => alert('Share link copied!')}>
            Share Checklist
          </button>
        </div>

      </div>
    </div>
  );
};

export default PackingChecklist;
