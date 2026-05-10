const pool = require('../config/db');

const CityModel = {
  // Search cities
  search: async (searchTerm, filters = {}) => {
    let query = `
      SELECT * FROM cities
      WHERE (name ILIKE $1 OR country ILIKE $1 OR region ILIKE $1)
    `;
    
    const values = [`%${searchTerm}%`];
    let paramCount = 2;
    
    if (filters.country) {
      query += ` AND country = $${paramCount}`;
      values.push(filters.country);
      paramCount++;
    }
    
    if (filters.region) {
      query += ` AND region = $${paramCount}`;
      values.push(filters.region);
      paramCount++;
    }
    
    if (filters.min_cost_index) {
      query += ` AND cost_index >= $${paramCount}`;
      values.push(filters.min_cost_index);
      paramCount++;
    }
    
    if (filters.max_cost_index) {
      query += ` AND cost_index <= $${paramCount}`;
      values.push(filters.max_cost_index);
      paramCount++;
    }
    
    query += ` ORDER BY popularity_score DESC, name ASC LIMIT 50`;
    
    const result = await pool.query(query, values);
    return result.rows;
  },

  // Get all cities
  getAll: async (limit = 100) => {
    const query = `
      SELECT * FROM cities
      ORDER BY popularity_score DESC, name ASC
      LIMIT $1
    `;
    const result = await pool.query(query, [limit]);
    return result.rows;
  },

  // Get city by ID
  findById: async (cityId) => {
    const query = 'SELECT * FROM cities WHERE id = $1';
    const result = await pool.query(query, [cityId]);
    return result.rows[0];
  },

  // Get popular cities
  getPopular: async (limit = 10) => {
    const query = `
      SELECT * FROM cities
      ORDER BY popularity_score DESC
      LIMIT $1
    `;
    const result = await pool.query(query, [limit]);
    return result.rows;
  },

  // Get cities by country
  getByCountry: async (country) => {
    const query = `
      SELECT * FROM cities
      WHERE country = $1
      ORDER BY popularity_score DESC, name ASC
    `;
    const result = await pool.query(query, [country]);
    return result.rows;
  },

  // Get cities by region
  getByRegion: async (region) => {
    const query = `
      SELECT * FROM cities
      WHERE region = $1
      ORDER BY popularity_score DESC, name ASC
    `;
    const result = await pool.query(query, [region]);
    return result.rows;
  },

  // Save destination for user
  saveDestination: async (userId, cityId, notes) => {
    const query = `
      INSERT INTO saved_destinations (user_id, city_id, notes)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, city_id) DO UPDATE
      SET notes = EXCLUDED.notes
      RETURNING *;
    `;
    const result = await pool.query(query, [userId, cityId, notes]);
    return result.rows[0];
  },

  // Get saved destinations
  getSavedDestinations: async (userId) => {
    const query = `
      SELECT sd.*, c.*
      FROM saved_destinations sd
      JOIN cities c ON sd.city_id = c.id
      WHERE sd.user_id = $1
      ORDER BY sd.created_at DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  },

  // Remove saved destination
  removeSavedDestination: async (userId, cityId) => {
    const query = `
      DELETE FROM saved_destinations
      WHERE user_id = $1 AND city_id = $2
      RETURNING *;
    `;
    const result = await pool.query(query, [userId, cityId]);
    return result.rows[0];
  }
};

module.exports = CityModel;