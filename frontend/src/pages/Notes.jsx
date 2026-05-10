import React, { useState, useEffect } from 'react';
import { fetchNotes, addNote } from '../services/api';

const Notes = ({ tripId }) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    if (tripId) fetchNotes(tripId).then(res => setNotes(res.data.data || []));
  }, [tripId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    await addNote(tripId, { content: newNote });
    setNewNote('');
    fetchNotes(tripId).then(res => setNotes(res.data.data || []));
  };

  return (
    <div className="content-card">
      <h3>Trip Notes</h3>
      <form onSubmit={handleAdd} style={{marginBottom: '20px'}}>
        <textarea 
          value={newNote} 
          onChange={(e) => setNewNote(e.target.value)} 
          placeholder="Flight details, hotel addresses, etc..." 
          style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', minHeight: '80px'}}
        />
        <button type="submit" style={{marginTop: '10px', padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px'}}>Save Note</button>
      </form>
      {notes.map(note => (
        <div key={note.id} style={{padding: '15px', background: '#f8fafc', borderRadius: '8px', marginBottom: '10px', borderLeft: '4px solid #2563eb'}}>
          {note.content}
        </div>
      ))}
    </div>
  );
};

export default Notes;