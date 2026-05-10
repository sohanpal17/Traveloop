const pool = require('../config/db');

const PackingModel = {
  // Create packing item
  create: async (packingData) => {
    const { trip_id, item_name, category, quantity, is_packed, priority, notes } = packingData;
    
    const query = `
      INSERT INTO packing_items (trip_id, item_name, category, quantity, is_packed, priority, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    
    const values = [trip_id, item_name, category, quantity || 1, is_packed || false, priority || 'medium', notes];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Get packing items by trip
  findByTripId: async (tripId) => {
    const query = `
      SELECT * FROM packing_items
      WHERE trip_id = $1
      ORDER BY 
        CASE priority 
          WHEN 'high' THEN 1
          WHEN 'medium' THEN 2
          WHEN 'low' THEN 3
        END,
        category ASC,
        created_at ASC
    `;
    const result = await pool.query(query, [tripId]);
    return result.rows;
  },

  // Get packing items by category
  findByCategory: async (tripId, category) => {
    const query = `
      SELECT * FROM packing_items
      WHERE trip_id = $1 AND category = $2
      ORDER BY created_at ASC
    `;
    const result = await pool.query(query, [tripId, category]);
    return result.rows;
  },

  // Update packing item
  update: async (packingId, updateData) => {
    const allowedFields = ['item_name', 'category', 'quantity', 'is_packed', 'priority', 'notes'];
    const updates = [];
    const values = [packingId];
    
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
      UPDATE packing_items
      SET ${updates.join(', ')}
      WHERE id = $1
      RETURNING *;
    `;
    
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Toggle packed status
  togglePacked: async (packingId) => {
    const query = `
      UPDATE packing_items
      SET is_packed = NOT is_packed, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *;
    `;
    const result = await pool.query(query, [packingId]);
    return result.rows[0];
  },

  // Delete packing item
  delete: async (packingId) => {
    const query = 'DELETE FROM packing_items WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [packingId]);
    return result.rows[0];
  },

  // Get packing summary
  getSummary: async (tripId) => {
    const query = `
      SELECT 
        COUNT(*) as total_items,
        COUNT(CASE WHEN is_packed = true THEN 1 END) as packed_items,
        COUNT(CASE WHEN is_packed = false THEN 1 END) as unpacked_items,
        COUNT(CASE WHEN priority = 'high' THEN 1 END) as high_priority,
        COUNT(CASE WHEN priority = 'medium' THEN 1 END) as medium_priority,
        COUNT(CASE WHEN priority = 'low' THEN 1 END) as low_priority
      FROM packing_items
      WHERE trip_id = $1
    `;
    const result = await pool.query(query, [tripId]);
    return result.rows[0];
  },

  // Reset all packed status
  resetAll: async (tripId) => {
    const query = `
      UPDATE packing_items
      SET is_packed = false, updated_at = CURRENT_TIMESTAMP
      WHERE trip_id = $1
      RETURNING *;
    `;
    const result = await pool.query(query, [tripId]);
    return result.rows;
  }
};

module.exports = PackingModel;