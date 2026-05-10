import React, { useState } from 'react';
import { createTrip } from '../../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const TripForm = ({ onTripCreated }) => {
  const [title, setTitle] = useState('');
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send the current user's ID and empty strings for optional fields
      await createTrip({ 
        title, 
        user_id: user?.id,
        description: '',
        start_date: new Date().toISOString(), // Default to today
        end_date: new Date().toISOString()
      });
      
      toast.success('New trip started!');
      setTitle(''); // Clear input
      onTripCreated(); // Force Dashboard to fetch fresh data
    } catch (err) {
      toast.error('Could not create trip');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
      <input 
        type="text" 
        placeholder="Where are you going?" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)}
        required 
        style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
      />
      <button type="submit" style={{ 
        padding: '12px 20px', 
        backgroundColor: '#2563eb', 
        color: 'white', 
        border: 'none', 
        borderRadius: '8px', 
        cursor: 'pointer',
        fontWeight: 'bold'
      }}>
        Add Trip
      </button>
    </form>
  );
};

export default TripForm;