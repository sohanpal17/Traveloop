const pool = require('../config/db');

const BudgetModel = {
  // Create budget item
  create: async (budgetData) => {
    const { trip_id, stop_id, category, item_name, estimated_cost, actual_cost, date, notes } = budgetData;
    
    const query = `
      INSERT INTO budget_items (trip_id, stop_id, category, item_name, estimated_cost, actual_cost, date, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;
    
    const values = [trip_id, stop_id, category, item_name, estimated_cost, actual_cost, date, notes];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Get budget items by trip
  findByTripId: async (tripId) => {
    const query = `
      SELECT b.*, s.city, s.country
      FROM budget_items b
      LEFT JOIN stops s ON b.stop_id = s.id
      WHERE b.trip_id = $1
      ORDER BY b.date ASC, b.created_at DESC
    `;
    const result = await pool.query(query, [tripId]);
    return result.rows;
  },

  // Get budget breakdown by category
  getCategoryBreakdown: async (tripId) => {
    const query = `
      SELECT 
        category,
        COUNT(*) as item_count,
        SUM(estimated_cost) as total_estimated,
        SUM(actual_cost) as total_actual,
        SUM(COALESCE(actual_cost, estimated_cost)) as total_combined
      FROM budget_items
      WHERE trip_id = $1
      GROUP BY category
      ORDER BY total_combined DESC
    `;
    const result = await pool.query(query, [tripId]);
    return result.rows;
  },

  // Get budget summary
  getSummary: async (tripId) => {
    const query = `
      SELECT 
        COUNT(*) as total_items,
        SUM(estimated_cost) as total_estimated,
        SUM(actual_cost) as total_actual,
        SUM(COALESCE(actual_cost, estimated_cost)) as total_spent
      FROM budget_items
      WHERE trip_id = $1
    `;
    const result = await pool.query(query, [tripId]);
    return result.rows[0];
  },

  // Get daily budget breakdown
  getDailyBreakdown: async (tripId) => {
    const query = `
      SELECT 
        date,
        COUNT(*) as item_count,
        SUM(estimated_cost) as daily_estimated,
        SUM(actual_cost) as daily_actual,
        SUM(COALESCE(actual_cost, estimated_cost)) as daily_total
      FROM budget_items
      WHERE trip_id = $1 AND date IS NOT NULL
      GROUP BY date
      ORDER BY date ASC
    `;
    const result = await pool.query(query, [tripId]);
    return result.rows;
  },

  // Update budget item
  update: async (budgetId, updateData) => {
    const allowedFields = ['category', 'item_name', 'estimated_cost', 'actual_cost', 'date', 'notes'];
    const updates = [];
    const values = [budgetId];
    
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
      UPDATE budget_items
      SET ${updates.join(', ')}
      WHERE id = $1
      RETURNING *;
    `;
    
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Delete budget item
  delete: async (budgetId) => {
    const query = 'DELETE FROM budget_items WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [budgetId]);
    return result.rows[0];
  }
};

module.exports = BudgetModel;