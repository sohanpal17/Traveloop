const pool = require('../config/db');

const StopModel = {
  // Create new stop
  create: async (stopData) => {
    const { trip_id, city, country, start_date, end_date, duration_days, notes, order_index, latitude, longitude } = stopData;
    
    const query = `
      INSERT INTO stops (trip_id, city, country, start_date, end_date, duration_days, notes, order_index, latitude, longitude)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `;
    
    const values = [trip_id, city, country, start_date, end_date, duration_days, notes, order_index || 0, latitude, longitude];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Get stops by trip ID
  findByTripId: async (tripId) => {
    const query = `
      SELECT s.*,
        COUNT(a.id) as activity_count,
        COALESCE(SUM(a.estimated_cost), 0) as total_estimated_cost
      FROM stops s
      LEFT JOIN activities a ON s.id = a.stop_id
      WHERE s.trip_id = $1
      GROUP BY s.id
      ORDER BY s.order_index ASC, s.start_date ASC
    `;
    const result = await pool.query(query, [tripId]);
    return result.rows;
  },

  // Get stop by ID
  findById: async (stopId) => {
    const query = 'SELECT * FROM stops WHERE id = $1';
    const result = await pool.query(query, [stopId]);
    return result.rows[0];
  },

  // Update stop
  update: async (stopId, updateData) => {
    const allowedFields = ['city', 'country', 'start_date', 'end_date', 'duration_days', 'notes', 'order_index', 'latitude', 'longitude'];
    const updates = [];
    const values = [stopId];
    
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
    
    const query = `
      UPDATE stops
      SET ${updates.join(', ')}
      WHERE id = $1
      RETURNING *;
    `;
    
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Delete stop
  delete: async (stopId) => {
    const query = 'DELETE FROM stops WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [stopId]);
    return result.rows[0];
  },

  // Reorder stops
  reorder: async (stopIds) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      for (let i = 0; i < stopIds.length; i++) {
        await client.query(
          'UPDATE stops SET order_index = $1 WHERE id = $2',
          [i, stopIds[i]]
        );
      }
      
      await client.query('COMMIT');
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  // Verify stop belongs to user's trip
  verifyOwnership: async (stopId, userId) => {
    const query = `
      SELECT s.* FROM stops s
      JOIN trips t ON s.trip_id = t.id
      WHERE s.id = $1 AND t.user_id = $2
    `;
    const result = await pool.query(query, [stopId, userId]);
    return result.rows[0];
  }
};

module.exports = StopModel;