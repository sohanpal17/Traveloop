import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Community.css';

/**
 * Community Tab — Screen 10
 * Shows public trips shared by all users.
 *
 * Database tables linked:
 *   trips: { user_id, title, description, start_date, end_date, cover_photo_url, total_budget, is_public }
 *   users: { display_name, photo_url, city, country }
 *   stops: { trip_id, city, country }
 *   activities: { stop_id, title, category }
 *
 * Description: Community section where all users can share their experience
 * about a certain trip or activity. Using search, groupby, filter, and sortby
 * options, the user can narrow down results.
 */

const mockPosts = [
  {
    id: 1,
    user: { display_name: 'Sarah Mitchell', photo_url: null, city: 'London', country: 'UK' },
    trip: { title: 'Backpacking Through Southeast Asia', description: 'Amazing 3-week journey through Thailand, Vietnam and Cambodia. The street food in Bangkok was incredible and Angkor Wat at sunrise is a must!', start_date: '2026-01-10', end_date: '2026-01-31', total_budget: 2400, is_public: true, cover_photo_url: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=600&q=80' },
    stops: ['Bangkok', 'Hanoi', 'Siem Reap'],
    activities: ['Temple tours', 'Street food crawl', 'Cooking class'],
    likes: 42, comments: 8, created_at: '2026-04-28'
  },
  {
    id: 2,
    user: { display_name: 'Marco Rossi', photo_url: null, city: 'Rome', country: 'Italy' },
    trip: { title: 'Road Trip: California Coast', description: 'Drove the Pacific Coast Highway from SF to LA. Big Sur views are unreal. Stopped at every taco stand along the way.', start_date: '2026-03-05', end_date: '2026-03-14', total_budget: 3200, is_public: true, cover_photo_url: 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=600&q=80' },
    stops: ['San Francisco', 'Big Sur', 'Los Angeles'],
    activities: ['Hiking', 'Beach surfing', 'Wine tasting'],
    likes: 67, comments: 15, created_at: '2026-04-22'
  },
  {
    id: 3,
    user: { display_name: 'Aiko Tanaka', photo_url: null, city: 'Tokyo', country: 'Japan' },
    trip: { title: 'Cherry Blossom Season in Kyoto', description: 'Spent a magical week in Kyoto during peak sakura season. The philosopher\'s path was breathtaking. Also explored hidden temples.', start_date: '2026-03-25', end_date: '2026-04-02', total_budget: 1800, is_public: true, cover_photo_url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80' },
    stops: ['Kyoto', 'Nara'],
    activities: ['Temple visits', 'Tea ceremony', 'Bamboo forest walk'],
    likes: 93, comments: 21, created_at: '2026-04-15'
  },
  {
    id: 4,
    user: { display_name: 'Elena Petrova', photo_url: null, city: 'Berlin', country: 'Germany' },
    trip: { title: 'Northern Lights in Iceland', description: 'Chased the aurora for 5 nights — caught it 3 times! The Blue Lagoon was heavenly. Rented a campervan and it was the best decision ever.', start_date: '2025-11-10', end_date: '2025-11-18', total_budget: 4100, is_public: true, cover_photo_url: 'https://images.unsplash.com/photo-1504829857797-ddff29c27927?auto=format&fit=crop&w=600&q=80' },
    stops: ['Reykjavik', 'Vik', 'Akureyri'],
    activities: ['Northern lights tour', 'Blue Lagoon', 'Glacier hike'],
    likes: 128, comments: 34, created_at: '2026-04-05'
  },
];

const CommunityTab = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [likedPosts, setLikedPosts] = useState([]);

  const filteredPosts = useMemo(() => {
    let results = [...mockPosts];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      results = results.filter(p =>
        p.trip.title.toLowerCase().includes(term) ||
        p.trip.description.toLowerCase().includes(term) ||
        p.user.display_name.toLowerCase().includes(term) ||
        p.stops.some(s => s.toLowerCase().includes(term)) ||
        p.activities.some(a => a.toLowerCase().includes(term))
      );
    }

    if (filterCategory !== 'all') {
      results = results.filter(p =>
        p.activities.some(a => a.toLowerCase().includes(filterCategory))
      );
    }

    switch (sortBy) {
      case 'popular': results.sort((a, b) => b.likes - a.likes); break;
      case 'comments': results.sort((a, b) => b.comments - a.comments); break;
      case 'budget_low': results.sort((a, b) => a.trip.total_budget - b.trip.total_budget); break;
      default: results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); break;
    }
    return results;
  }, [searchTerm, sortBy, filterCategory]);

  const handleLike = (postId) => {
    if (likedPosts.includes(postId)) {
      setLikedPosts(likedPosts.filter(id => id !== postId));
    } else {
      setLikedPosts([...likedPosts, postId]);
      toast.success('Post liked!');
    }
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const colors = ['#7DD5E8', '#F59E0B', '#8B5CF6', '#EC4899', '#10B981', '#F97316'];
  const getAvatarColor = (id) => colors[id % colors.length];

  return (
    <div className="cm-container">
      <div className="cm-background"></div>

      <div className="cm-content">
        {/* Header */}
        <header className="cm-topbar">
          <div className="cm-logo" onClick={() => navigate('/dashboard')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7L12 12L22 7L12 2Z"/><path d="M2 17L12 22L22 17"/><path d="M2 12L12 17L22 12"/></svg>
            <span>Traveloop</span>
          </div>
          <div className="cm-profile-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
        </header>

        {/* Search + Controls */}
        <div className="cm-search-bar">
          <div className="cm-search-input-wrap">
            <svg className="cm-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" className="cm-search-input" placeholder="Search trips, users, activities..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            {searchTerm && <button className="cm-clear-btn" onClick={() => setSearchTerm('')}>✕</button>}
          </div>
          <div className="cm-controls">
            <select className="cm-control-btn" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="all">Group by</option>
              <option value="hiking">Hiking</option>
              <option value="food">Food</option>
              <option value="temple">Temples</option>
              <option value="beach">Beach</option>
            </select>
            <button className={`cm-control-btn ${showFilters ? 'active' : ''}`} onClick={() => setShowFilters(!showFilters)}>Filter</button>
            <select className="cm-control-btn" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="recent">Sort: Recent</option>
              <option value="popular">Sort: Popular</option>
              <option value="comments">Sort: Most Discussed</option>
              <option value="budget_low">Sort: Budget ↑</option>
            </select>
          </div>
        </div>

        {showFilters && (
          <div className="cm-filter-panel">
            <div className="cm-filter-group">
              <label>Category</label>
              <select className="cm-filter-select" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                <option value="all">All Activities</option>
                <option value="hiking">Hiking</option>
                <option value="food">Food & Cuisine</option>
                <option value="temple">Temples & Culture</option>
                <option value="beach">Beach & Water</option>
                <option value="tour">Tours</option>
              </select>
            </div>
          </div>
        )}

        {/* Community Tab Heading */}
        <div className="cm-section-header">
          <h2>Community Tab</h2>
          <p>Explore shared travel experiences from fellow travelers</p>
        </div>

        {/* Description sidebar info (shown inline on mobile) */}
        <div className="cm-description-card">
          <h3>About Community</h3>
          <p>Community section where all users can share their experience about a certain trip or activity. Using the search, groupby or filter and sortby option, the user can narrow down the result that he is looking for.</p>
        </div>

        {/* Posts */}
        <div className="cm-posts-layout">
          <div className="cm-posts-list">
            {filteredPosts.length === 0 ? (
              <div className="cm-empty-state"><p>No posts match your search.</p></div>
            ) : (
              filteredPosts.map(post => (
                <div key={post.id} className="cm-post-card">
                  {/* User avatar */}
                  <div className="cm-post-avatar" style={{ background: getAvatarColor(post.id) }}>
                    {getInitials(post.user.display_name)}
                  </div>

                  {/* Post content */}
                  <div className="cm-post-body">
                    {/* Cover image */}
                    {post.trip.cover_photo_url && (
                      <div className="cm-post-cover">
                        <img src={post.trip.cover_photo_url} alt={post.trip.title} />
                      </div>
                    )}

                    {/* User info */}
                    <div className="cm-post-user">
                      <span className="cm-post-username">{post.user.display_name}</span>
                      <span className="cm-post-location">{post.user.city}, {post.user.country}</span>
                      <span className="cm-post-date">{post.created_at}</span>
                    </div>

                    {/* Trip info — maps to trips table */}
                    <h3 className="cm-post-title">{post.trip.title}</h3>
                    <p className="cm-post-desc">{post.trip.description}</p>

                    {/* Stops — maps to stops table */}
                    <div className="cm-post-tags">
                      {post.stops.map((stop, i) => (
                        <span key={i} className="cm-tag cm-tag-stop">{stop}</span>
                      ))}
                      {post.activities.slice(0, 2).map((act, i) => (
                        <span key={i} className="cm-tag cm-tag-activity">{act}</span>
                      ))}
                    </div>

                    {/* Meta — budget from trips, dates */}
                    <div className="cm-post-meta">
                      <span>₹{post.trip.total_budget.toLocaleString('en-IN')} budget</span>
                      <span>{post.trip.start_date} → {post.trip.end_date}</span>
                    </div>

                    {/* Actions */}
                    <div className="cm-post-actions">
                      <button className={`cm-action-btn ${likedPosts.includes(post.id) ? 'liked' : ''}`} onClick={() => handleLike(post.id)}>
                        ♥ {post.likes + (likedPosts.includes(post.id) ? 1 : 0)}
                      </button>
                      <button className="cm-action-btn">💬 {post.comments}</button>
                      <button className="cm-action-btn">↗ Share</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityTab;