import React, { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import './Dashboard.css';

const Dashboard = () => {
  const { userData, setUserData } = useAuth();
  const navigate = useNavigate();
  const profileMenuRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [groupBy, setGroupBy] = useState('Region');
  const [filterBy, setFilterBy] = useState('All');
  const [sortBy, setSortBy] = useState('Recommended');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    displayName: '',
    phoneNumber: '',
    city: '',
    country: '',
    additionalInfo: '',
    photoUrl: ''
  });

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleDocumentClick);
    return () => document.removeEventListener('mousedown', handleDocumentClick);
  }, []);

  useEffect(() => {
    if (userData) {
      setProfileForm({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        displayName: userData.displayName || '',
        phoneNumber: userData.phoneNumber || '',
        city: userData.city || '',
        country: userData.country || '',
        additionalInfo: userData.additionalInfo || '',
        photoUrl: userData.photoUrl || ''
      });
    }
  }, [userData]);

  const regionalSelections = [
    {
      id: 1,
      name: 'Japan',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=80',
      label: 'Kyoto'
    },
    {
      id: 2,
      name: 'Italy',
      image: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&w=900&q=80',
      label: 'Rome'
    },
    {
      id: 3,
      name: 'Indonesia',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80',
      label: 'Bali'
    },
    {
      id: 4,
      name: 'France',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80',
      label: 'Paris'
    },
    {
      id: 5,
      name: 'Thailand',
      image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=900&q=80',
      label: 'Bangkok'
    }
  ];

  const recentTrips = [
    {
      id: 1,
      title: 'Barcelona Coastal Week',
      dates: 'Mar 12 - Mar 19',
      region: 'Europe',
      image: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=900&q=80'
    },
    {
      id: 2,
      title: 'Tokyo City Break',
      dates: 'Apr 06 - Apr 13',
      region: 'Asia',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=900&q=80'
    },
    {
      id: 3,
      title: 'Bali Reset Retreat',
      dates: 'May 21 - May 30',
      region: 'Oceania',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80'
    }
  ];

  const filteredRegionalSelections = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return regionalSelections.filter((place) => {
      const matchesQuery = !query || `${place.name} ${place.label}`.toLowerCase().includes(query);
      const matchesFilter = filterBy === 'All' || place.name === filterBy || place.label === filterBy;
      return matchesQuery && matchesFilter;
    });
  }, [filterBy, searchQuery]);

  const filteredTrips = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    let trips = recentTrips.filter((trip) => {
      const matchesQuery = !query || `${trip.title} ${trip.region}`.toLowerCase().includes(query);
      const matchesFilter = filterBy === 'All' || trip.region === filterBy;
      return matchesQuery && matchesFilter;
    });

    if (sortBy === 'Newest') {
      trips = [...trips].reverse();
    }

    return trips;
  }, [filterBy, searchQuery, sortBy]);

  return (
    <div className="dashboard-shell">
      <div className="dashboard-background"></div>

      <div className="dashboard-card">
        <header className="dashboard-topbar">
          <div>
            <div className="brand-row">
              <span className="brand-mark"></span>
              <span className="brand-name">Traveloop</span>
            </div>
          </div>

          <div className="profile-menu-wrap" ref={profileMenuRef}>
            <button
              className="profile-badge"
              onClick={() => setIsProfileMenuOpen((value) => !value)}
              aria-label="Open profile menu"
            >
              {(userData?.displayName || userData?.firstName || 'T').slice(0, 1).toUpperCase()}
            </button>

            {isProfileMenuOpen && (
              <div className="profile-menu">
                <button
                  type="button"
                  className="profile-menu-item"
                  onClick={() => {
                    setIsProfileModalOpen(true);
                    setIsProfileMenuOpen(false);
                  }}
                >
                  Edit Profile
                </button>
                <button
                  type="button"
                  className="profile-menu-item"
                  onClick={async () => {
                    setIsProfileMenuOpen(false);
                    await authService.logout();
                    setUserData(null);
                    toast.success('Logged out successfully');
                    navigate('/login');
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        <section className="hero-banner">
          <div className="hero-banner__overlay"></div>
          <div className="hero-banner__content">
            <p className="hero-label">Welcome back</p>
            <h1>{userData?.displayName ? `Plan your next trip, ${userData.displayName}` : 'Plan your next trip'}</h1>
            <p>Search destinations, compare ideas, and pick up where you left off.</p>
          </div>
        </section>

        <div className="dashboard-toolbar">
          <label className="search-input" aria-label="Search">
            <span className="search-icon" aria-hidden="true">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search trips or destinations"
            />
          </label>

          <select value={groupBy} onChange={(event) => setGroupBy(event.target.value)} className="toolbar-select">
            <option value="Region">Group by</option>
            <option value="Region">Region</option>
            <option value="Season">Season</option>
            <option value="Type">Type</option>
          </select>

          <select value={filterBy} onChange={(event) => setFilterBy(event.target.value)} className="toolbar-select">
            <option value="All">Filter</option>
            <option value="All">All</option>
            <option value="Europe">Europe</option>
            <option value="Asia">Asia</option>
            <option value="Oceania">Oceania</option>
            <option value="France">France</option>
            <option value="Japan">Japan</option>
          </select>

          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="toolbar-select">
            <option value="Recommended">Sort by...</option>
            <option value="Recommended">Recommended</option>
            <option value="Newest">Newest</option>
          </select>
        </div>

        <section className="section-block">
          <div className="section-heading">
            <h2>Top Regional Selections</h2>
            <span></span>
          </div>

          <div className="regional-grid">
            {filteredRegionalSelections.map((place) => (
              <button
                key={place.id}
                className="regional-card"
                style={{ backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.05), rgba(0,0,0,0.52)), url(${place.image})` }}
                onClick={() => navigate('/trips')}
              >
                <span className="regional-card__name">{place.label}</span>
                <span className="regional-card__sub">{place.name}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="section-block section-block--spacious">
          <div className="section-heading">
            <h2>Previous Trips</h2>
            <span></span>
          </div>

          <div className="trips-row">
            {filteredTrips.map((trip) => (
              <article key={trip.id} className="previous-trip-card" style={{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.55)), url(${trip.image})` }}>
                <div className="previous-trip-card__content">
                  <span>{trip.region}</span>
                  <h3>{trip.title}</h3>
                  <p>{trip.dates}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <button className="plan-fab" onClick={() => navigate('/create-trip')}>
          <span>+</span> Plan a trip
        </button>

        {isProfileModalOpen && (
          <div className="profile-modal-backdrop" onClick={() => setIsProfileModalOpen(false)}>
            <div className="profile-modal" onClick={(event) => event.stopPropagation()}>
              <div className="profile-modal__header">
                <div>
                  <h2>Edit Profile</h2>
                  <p>Update your travel profile details.</p>
                </div>
                <button type="button" className="profile-modal__close" onClick={() => setIsProfileModalOpen(false)}>
                  ×
                </button>
              </div>

              <div className="profile-modal__avatar">
                <div className="profile-modal__circle">
                  {profileForm.photoUrl ? (
                    <img src={profileForm.photoUrl} alt="Profile" />
                  ) : (
                    <span>{(profileForm.displayName || userData?.displayName || 'T').slice(0, 1).toUpperCase()}</span>
                  )}
                </div>
              </div>

              <div className="profile-form-grid">
                <label>
                  First Name
                  <input
                    type="text"
                    value={profileForm.firstName}
                    onChange={(event) => setProfileForm((previous) => ({ ...previous, firstName: event.target.value }))}
                  />
                </label>
                <label>
                  Last Name
                  <input
                    type="text"
                    value={profileForm.lastName}
                    onChange={(event) => setProfileForm((previous) => ({ ...previous, lastName: event.target.value }))}
                  />
                </label>
                <label className="profile-form-grid__full">
                  Display Name
                  <input
                    type="text"
                    value={profileForm.displayName}
                    onChange={(event) => setProfileForm((previous) => ({ ...previous, displayName: event.target.value }))}
                  />
                </label>
                <label>
                  Phone Number
                  <input
                    type="tel"
                    value={profileForm.phoneNumber}
                    onChange={(event) => setProfileForm((previous) => ({ ...previous, phoneNumber: event.target.value }))}
                  />
                </label>
                <label>
                  City
                  <input
                    type="text"
                    value={profileForm.city}
                    onChange={(event) => setProfileForm((previous) => ({ ...previous, city: event.target.value }))}
                  />
                </label>
                <label>
                  Country
                  <input
                    type="text"
                    value={profileForm.country}
                    onChange={(event) => setProfileForm((previous) => ({ ...previous, country: event.target.value }))}
                  />
                </label>
                <label className="profile-form-grid__full">
                  Additional Information
                  <textarea
                    rows="4"
                    value={profileForm.additionalInfo}
                    onChange={(event) => setProfileForm((previous) => ({ ...previous, additionalInfo: event.target.value }))}
                  />
                </label>
                <label className="profile-form-grid__full">
                  Photo URL
                  <input
                    type="url"
                    value={profileForm.photoUrl}
                    onChange={(event) => setProfileForm((previous) => ({ ...previous, photoUrl: event.target.value }))}
                  />
                </label>
              </div>

              <div className="profile-modal__actions">
                <button type="button" className="profile-action profile-action--ghost" onClick={() => setIsProfileModalOpen(false)}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="profile-action"
                  disabled={profileSaving}
                  onClick={async () => {
                    setProfileSaving(true);
                    try {
                      const updatedUser = await authService.updateProfile(profileForm);
                      setUserData(updatedUser);
                      localStorage.setItem('user', JSON.stringify(updatedUser));
                      toast.success('Profile updated successfully');
                      setIsProfileModalOpen(false);
                    } catch (error) {
                      console.error('Profile update error:', error);
                      toast.error('Failed to update profile');
                    } finally {
                      setProfileSaving(false);
                    }
                  }}
                >
                  {profileSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
