import React, { useEffect, useState } from 'react';
import { fetchPublicTrips } from '../services/api';

const Explore = () => {
  const [publicTrips, setPublicTrips] = useState([]);

  useEffect(() => {
    fetchPublicTrips().then(res => setPublicTrips(res.data.trips || []));
  }, []);

  return (
    <div className="dashboard-wrapper">
      <div className="main-content">
        <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>Community Feed</h1>
        <p style={{ color: '#64748b', marginBottom: '30px' }}>Hand-picked travel itineraries from experts.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
          {publicTrips.map(trip => (
            <div key={trip.id} className="content-card" style={{ padding: '0', overflow: 'hidden', transition: 'transform 0.2s' }}>
              <div style={{ height: '180px', background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '40px' }}>
                ✈️
              </div>
              <div style={{ padding: '20px' }}>
                <span style={{ color: '#2563eb', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>Featured Trip</span>
                <h3 style={{ margin: '10px 0', fontSize: '20px' }}>{trip.title}</h3>
                <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.5', minHeight: '45px' }}>{trip.description || "Join this amazing journey through the heart of the destination."}</p>
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#cbd5e1' }}></div>
                    <span style={{ fontSize: '13px', fontWeight: '600' }}>{trip.author}</span>
                  </div>
                  <button style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #e2e8f0', background: 'white', fontWeight: '600', cursor: 'pointer' }}>View Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Explore;