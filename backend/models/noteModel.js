const pool = require('../config/db');

const NoteModel = {
  // Create note
  create: async (noteData) => {
    const { trip_id, stop_id, title, content, note_date } = noteData;
    
    const query = `
      INSERT INTO trip_notes (trip_id, stop_id, title, content, note_date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    
    const values = [trip_id, stop_id, title, content, note_date];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Get notes by trip
  findByTripId: async (tripId) => {
    const query = `
      SELECT n.*, s.city, s.country
      FROM trip_notes n
      LEFT JOIN stops s ON n.stop_id = s.id
      WHERE n.trip_id = $1
      ORDER BY n.note_date DESC, n.created_at DESC
    `;
    const result = await pool.query(query, [tripId]);
    return result.rows;
  },

  // Get notes by stop
  findByStopId: async (stopId) => {
    const query = `
      SELECT * FROM trip_notes
      WHERE stop_id = $1
      ORDER BY note_date DESC, created_at DESC
    `;
    const result = await pool.query(query, [stopId]);
    return result.rows;
  },

  // Get note by ID
  findById: async (noteId) => {
    const query = 'SELECT * FROM trip_notes WHERE id = $1';
    const result = await pool.query(query, [noteId]);
    return result.rows[0];
  },

  // Update note
  update: async (noteId, updateData) => {
    const allowedFields = ['title', 'content', 'note_date', 'stop_id'];
    const updates = [];
    const values = [noteId];
    
    let paramCount = 2;
    
    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key) && value !== undefined) {
        updates.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }
    
    if (updates.length === 0) {
      throw new Error('No valid fields to update');
    }
    
    updates.push('updated_at = CURRENT_TIMESTAMP');
    
    const query = `
      UPDATE trip_notes
      SET ${updates.join(', ')}
      WHERE id = $1
      RETURNING *;
    `;
    
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Delete note
  delete: async (noteId) => {
    const query = 'DELETE FROM trip_notes WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [noteId]);
    return result.rows[0];
  },

  // Search notes
  search: async (tripId, searchTerm) => {
    const query = `
      SELECT n.*, s.city, s.country
      FROM trip_notes n
      LEFT JOIN stops s ON n.stop_id = s.id
      WHERE n.trip_id = $1 AND (
        n.title ILIKE $2 OR
        n.content ILIKE $2
      )
      ORDER BY n.note_date DESC, n.created_at DESC
    `;
    const result = await pool.query(query, [tripId, `%${searchTerm}%`]);
    return result.rows;
  }
};

module.exports = NoteModel;