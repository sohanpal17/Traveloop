const pool = require('../config/db');

const TripModel = {
  // Create new trip
  create: async (userId, tripData) => {
    const { title, description, start_date, end_date, cover_photo_url, total_budget, is_public } = tripData;
    
    const query = `
      INSERT INTO trips (user_id, title, description, start_date, end_date, cover_photo_url, total_budget, is_public)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;
    
    const values = [userId, title, description, start_date, end_date, cover_photo_url, total_budget || 0, is_public || false];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Get all trips for a user
  findByUserId: async (userId, filters = {}) => {
    let query = `
      SELECT t.*, 
        COUNT(DISTINCT s.id) as stop_count,
        COUNT(DISTINCT a.id) as activity_count
      FROM trips t
      LEFT JOIN stops s ON t.id = s.trip_id
      LEFT JOIN activities a ON s.id = a.stop_id
      WHERE t.user_id = $1
    `;
    
    const values = [userId];
    
    if (filters.is_public !== undefined) {
      query += ` AND t.is_public = $${values.length + 1}`;
      values.push(filters.is_public);
    }
    
    query += ` GROUP BY t.id ORDER BY t.created_at DESC`;
    
    const result = await pool.query(query, values);
    return result.rows;
  },

  // Get trip by ID
  findById: async (tripId, userId = null) => {
    let query = `
      SELECT t.*, 
        u.display_name as creator_name,
        COUNT(DISTINCT s.id) as stop_count,
        COUNT(DISTINCT a.id) as activity_count
      FROM trips t
      LEFT JOIN users u ON t.user_id = u.id
      LEFT JOIN stops s ON t.id = s.trip_id
      LEFT JOIN activities a ON s.id = a.stop_id
      WHERE t.id = $1
    `;
    
    const values = [tripId];
    
    if (userId) {
      query += ` AND t.user_id = $2`;
      values.push(userId);
    }
    
    query += ` GROUP BY t.id, u.display_name`;
    
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Update trip
  update: async (tripId, userId, updateData) => {
    const allowedFields = ['title', 'description', 'start_date', 'end_date', 'cover_photo_url', 'total_budget', 'is_public'];
    const updates = [];
    const values = [tripId, userId];
    
    let paramCount = 3;
    
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
    
    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    
    const query = `
      UPDATE trips
      SET ${updates.join(', ')}
      WHERE id = $1 AND user_id = $2
      RETURNING *;
    `;
    
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Delete trip
  delete: async (tripId, userId) => {
    const query = 'DELETE FROM trips WHERE id = $1 AND user_id = $2 RETURNING *';
    const result = await pool.query(query, [tripId, userId]);
    return result.rows[0];
  },

  // Generate public URL slug
  generatePublicSlug: async (tripId) => {
    const slug = `trip-${tripId}-${Math.random().toString(36).substr(2, 9)}`;
    const query = 'UPDATE trips SET public_url_slug = $1 WHERE id = $2 RETURNING *';
    const result = await pool.query(query, [slug, tripId]);
    return result.rows[0];
  },

  // Get trip by public slug
  findByPublicSlug: async (slug) => {
    const query = `
      SELECT t.*, 
        u.display_name as creator_name,
        u.photo_url as creator_photo
      FROM trips t
      LEFT JOIN users u ON t.user_id = u.id
      WHERE t.public_url_slug = $1 AND t.is_public = true
    `;
    const result = await pool.query(query, [slug]);
    return result.rows[0];
  },

  // Get recent trips
  getRecent: async (userId, limit = 5) => {
    const query = `
      SELECT * FROM trips
      WHERE user_id = $1
      ORDER BY updated_at DESC
      LIMIT $2
    `;
    const result = await pool.query(query, [userId, limit]);
    return result.rows;
  },

  // Get trip statistics
  getStatistics: async (tripId) => {
    const query = `
      SELECT 
        COUNT(DISTINCT s.id) as total_stops,
        COUNT(DISTINCT a.id) as total_activities,
        COALESCE(SUM(a.estimated_cost), 0) as total_estimated_cost,
        COALESCE(SUM(a.actual_cost), 0) as total_actual_cost,
        COUNT(DISTINCT CASE WHEN a.is_completed = true THEN a.id END) as completed_activities
      FROM trips t
      LEFT JOIN stops s ON t.id = s.trip_id
      LEFT JOIN activities a ON s.id = a.stop_id
      WHERE t.id = $1
      GROUP BY t.id
    `;
    const result = await pool.query(query, [tripId]);
    return result.rows[0];
  }
};

module.exports = TripModel;