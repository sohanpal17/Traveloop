const pool = require('../config/db');

const ActivityModel = {
  // Create new activity
  create: async (activityData) => {
    const {
      stop_id, title, description, category, estimated_cost,
      actual_cost, date, time, duration_minutes, location,
      booking_url, is_completed
    } = activityData;
    
    const query = `
      INSERT INTO activities (
        stop_id, title, description, category, estimated_cost,
        actual_cost, date, time, duration_minutes, location,
        booking_url, is_completed
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *;
    `;
    
    const values = [
      stop_id, title, description, category, estimated_cost || 0,
      actual_cost, date, time, duration_minutes, location,
      booking_url, is_completed || false
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Get activities by stop ID
  findByStopId: async (stopId) => {
    const query = `
      SELECT * FROM activities
      WHERE stop_id = $1
      ORDER BY date ASC, time ASC
    `;
    const result = await pool.query(query, [stopId]);
    return result.rows;
  },

  // Get activities by trip ID
  findByTripId: async (tripId) => {
    const query = `
      SELECT a.*, s.city, s.country
      FROM activities a
      JOIN stops s ON a.stop_id = s.id
      WHERE s.trip_id = $1
      ORDER BY a.date ASC, a.time ASC
    `;
    const result = await pool.query(query, [tripId]);
    return result.rows;
  },

  // Get activity by ID
  findById: async (activityId) => {
    const query = 'SELECT * FROM activities WHERE id = $1';
    const result = await pool.query(query, [activityId]);
    return result.rows[0];
  },

  // Update activity
  update: async (activityId, updateData) => {
    const allowedFields = [
      'title', 'description', 'category', 'estimated_cost', 'actual_cost',
      'date', 'time', 'duration_minutes', 'location', 'booking_url', 'is_completed'
    ];
    const updates = [];
    const values = [activityId];
    
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
      UPDATE activities
      SET ${updates.join(', ')}
      WHERE id = $1
      RETURNING *;
    `;
    
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Delete activity
  delete: async (activityId) => {
    const query = 'DELETE FROM activities WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [activityId]);
    return result.rows[0];
  },

  // Search activities by category
  searchByCategory: async (stopId, category) => {
    const query = `
      SELECT * FROM activities
      WHERE stop_id = $1 AND category ILIKE $2
      ORDER BY date ASC, time ASC
    `;
    const result = await pool.query(query, [stopId, `%${category}%`]);
    return result.rows;
  },

  // Get activities summary
  getSummary: async (tripId) => {
    const query = `
      SELECT 
        category,
        COUNT(*) as count,
        SUM(estimated_cost) as total_estimated,
        SUM(actual_cost) as total_actual
      FROM activities a
      JOIN stops s ON a.stop_id = s.id
      WHERE s.trip_id = $1
      GROUP BY category
    `;
    const result = await pool.query(query, [tripId]);
    return result.rows;
  },

  // Mark activity as completed
  markCompleted: async (activityId, isCompleted) => {
    const query = `
      UPDATE activities
      SET is_completed = $1
      WHERE id = $2
      RETURNING *;
    `;
    const result = await pool.query(query, [isCompleted, activityId]);
    return result.rows[0];
  }
};

module.exports = ActivityModel;