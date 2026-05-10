import React, { useState } from 'react';
import { createTrip } from '../../services/api';
import { toast } from 'react-toastify';

const TripForm = ({ onTripCreated }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTrip({ title });
      toast.success('New trip started!');
      setTitle('');
      onTripCreated(); // This refreshes the list on the Dashboard
    } catch (err) {
      toast.error('Could not create trip');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: '20px 0' }}>
      <input 
        type="text" 
        placeholder="Where are you going?" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)}
        required 
        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
      />
      <button type="submit" style={{ marginLeft: '10px', padding: '8px 16px' }}>
        Add Trip
      </button>
    </form>
  );
};

export default TripForm;