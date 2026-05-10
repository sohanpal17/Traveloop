import React from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="main-content">
      <h1>Account Settings</h1>
      <div className="content-card" style={{maxWidth: '500px', marginTop: '20px'}}>
        <div style={{marginBottom: '20px'}}>
          <label style={{display: 'block', color: '#64748b', marginBottom: '5px'}}>Full Name</label>
          <div style={{fontSize: '18px', fontWeight: 'bold'}}>{user?.name || 'Traveler'}</div>
        </div>
        <div style={{marginBottom: '20px'}}>
          <label style={{display: 'block', color: '#64748b', marginBottom: '5px'}}>Email Address</label>
          <div style={{fontSize: '18px', fontWeight: 'bold'}}>{user?.email}</div>
        </div>
        <button style={{padding: '10px 20px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer'}}>
          Update Password
        </button>
      </div>
    </div>
  );
};

export default Profile;