import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './CitySearch.css';

const mockCities = [
  { id: 1, name: 'Paris', country: 'France', region: 'Europe', popularity_score: 98, cost_index: 4, description: 'The City of Light with world-class art and cuisine.' },
  { id: 2, name: 'Tokyo', country: 'Japan', region: 'Asia', popularity_score: 96, cost_index: 4, description: 'Ultra-modern tech meets ancient temples.' },
  { id: 3, name: 'Bali', country: 'Indonesia', region: 'Asia', popularity_score: 92, cost_index: 2, description: 'Tropical paradise with beaches and rice terraces.' },
  { id: 4, name: 'Rome', country: 'Italy', region: 'Europe', popularity_score: 95, cost_index: 3, description: 'Ancient ruins, world-class pasta, the Colosseum.' },
  { id: 5, name: 'New York', country: 'USA', region: 'North America', popularity_score: 97, cost_index: 5, description: 'The city that never sleeps — Broadway and skyline.' },
  { id: 6, name: 'Kyoto', country: 'Japan', region: 'Asia', popularity_score: 88, cost_index: 3, description: 'Traditional temples and cherry blossoms.' },
  { id: 7, name: 'Barcelona', country: 'Spain', region: 'Europe', popularity_score: 91, cost_index: 3, description: 'Gaudi, tapas bars, Mediterranean beaches.' },
  { id: 8, name: 'Dubai', country: 'UAE', region: 'Middle East', popularity_score: 90, cost_index: 4, description: 'Futuristic skyline and desert adventures.' },
  { id: 9, name: 'Cape Town', country: 'South Africa', region: 'Africa', popularity_score: 85, cost_index: 2, description: 'Table Mountain and stunning coastline.' },
  { id: 10, name: 'Sydney', country: 'Australia', region: 'Oceania', popularity_score: 89, cost_index: 4, description: 'Opera House and Bondi Beach.' },
  { id: 11, name: 'Bangkok', country: 'Thailand', region: 'Asia', popularity_score: 87, cost_index: 1, description: 'Golden temples and legendary street food.' },
  { id: 12, name: 'London', country: 'UK', region: 'Europe', popularity_score: 96, cost_index: 5, description: 'Royal palaces and West End theatre.' },
];

const regions = ['All Regions', 'Europe', 'Asia', 'North America', 'Middle East', 'Africa', 'Oceania'];
const countries = ['All Countries', ...new Set(mockCities.map(c => c.country))];

const CitySearch = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [selectedCountry, setSelectedCountry] = useState('All Countries');
  const [sortBy, setSortBy] = useState('popularity');
  const [addedCities, setAddedCities] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const filteredCities = useMemo(() => {
    let results = [...mockCities];
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      results = results.filter(c =>
        c.name.toLowerCase().includes(term) ||
        c.country.toLowerCase().includes(term) ||
        c.region.toLowerCase().includes(term)
      );
    }
    if (selectedRegion !== 'All Regions') results = results.filter(c => c.region === selectedRegion);
    if (selectedCountry !== 'All Countries') results = results.filter(c => c.country === selectedCountry);
    switch (sortBy) {
      case 'name': results.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'cost_low': results.sort((a, b) => a.cost_index - b.cost_index); break;
      case 'cost_high': results.sort((a, b) => b.cost_index - a.cost_index); break;
      default: results.sort((a, b) => b.popularity_score - a.popularity_score); break;
    }
    return results;
  }, [searchTerm, selectedRegion, selectedCountry, sortBy]);

  const handleAddToTrip = (city) => {
    if (addedCities.includes(city.id)) {
      setAddedCities(addedCities.filter(id => id !== city.id));
      toast.info(`${city.name} removed`);
    } else {
      setAddedCities([...addedCities, city.id]);
      toast.success(`${city.name} added to trip!`);
    }
  };

  const costLabel = (i) => ['', 'Budget', 'Affordable', 'Moderate', 'Expensive', 'Luxury'][i] || '';
  const costDots = (i) => '●'.repeat(i) + '○'.repeat(5 - i);

  return (
    <div className="cs-container">
      <div className="cs-background"></div>
      <div className="cs-content">
        <header className="cs-topbar">
          <div className="cs-logo" onClick={() => navigate('/dashboard')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7L12 12L22 7L12 2Z"/><path d="M2 17L12 22L22 17"/><path d="M2 12L12 17L22 12"/></svg>
            <span>Traveloop</span>
          </div>
          <div className="cs-profile-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
        </header>

        <div className="cs-search-bar">
          <div className="cs-search-input-wrap">
            <svg className="cs-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" className="cs-search-input" placeholder="Search cities, countries, or regions..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            {searchTerm && <button className="cs-clear-btn" onClick={() => setSearchTerm('')}>✕</button>}
          </div>
          <div className="cs-controls">
            <select className="cs-control-btn" value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)}>
              {regions.map(r => <option key={r} value={r}>{r === 'All Regions' ? 'Group by' : r}</option>)}
            </select>
            <button className={`cs-control-btn ${showFilters ? 'active' : ''}`} onClick={() => setShowFilters(!showFilters)}>Filter</button>
            <select className="cs-control-btn" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="popularity">Sort: Popular</option>
              <option value="name">Sort: A-Z</option>
              <option value="cost_low">Sort: Cost ↑</option>
              <option value="cost_high">Sort: Cost ↓</option>
            </select>
          </div>
        </div>

        {showFilters && (
          <div className="cs-filter-panel">
            <div className="cs-filter-group">
              <label>Country</label>
              <select className="cs-filter-select" value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)}>
                {countries.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="cs-filter-group">
              <label>Region</label>
              <select className="cs-filter-select" value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)}>
                {regions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
        )}

        <div className="cs-results-header">
          <h2>Results</h2>
          <span className="cs-results-count">{filteredCities.length} cities found</span>
        </div>

        <div className="cs-results-list">
          {filteredCities.length === 0 ? (
            <div className="cs-empty-state"><p>No cities match your search.</p></div>
          ) : (
            filteredCities.map(city => (
              <div key={city.id} className={`cs-city-card ${addedCities.includes(city.id) ? 'added' : ''}`}>
                <div className="cs-city-details">
                  <div className="cs-city-name-row">
                    <h3>{city.name}</h3>
                    <span className="cs-city-country">{city.country}</span>
                  </div>
                  <p className="cs-city-desc">{city.description}</p>
                  <div className="cs-city-meta">
                    <span className="cs-meta-chip">{city.region}</span>
                    <span className="cs-meta-chip" title={costLabel(city.cost_index)}>{costDots(city.cost_index)} {costLabel(city.cost_index)}</span>
                    <span className="cs-meta-chip cs-popularity">★ {city.popularity_score}</span>
                  </div>
                </div>
                <button className={`cs-add-btn ${addedCities.includes(city.id) ? 'added' : ''}`} onClick={() => handleAddToTrip(city)}>
                  {addedCities.includes(city.id) ? '✓ Added' : '+ Add to Trip'}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CitySearch;
