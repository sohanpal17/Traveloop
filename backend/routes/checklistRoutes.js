const express = require('express');
const router = express.Router({ mergeParams: true });
const pool = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// GET: Sync with frontend Dashboard
router.get('/', async (req, res) => {
  const { tripId } = req.params;
  if (!tripId || tripId === 'undefined') return res.json({ success: true, items: [] });

  try {
    const result = await pool.query(
      `SELECT * FROM checklist_items WHERE trip_id = $1 ORDER BY created_at ASC`,
      [tripId]
    );
    // Returning 'items' to match the frontend call
    res.json({ success: true, items: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST: Change 'label' to 'item_name' to match frontend TripForm
router.post('/', async (req, res) => {
  const { item_name, category } = req.body;
  const { tripId } = req.params;

  if (!item_name) return res.status(400).json({ success: false, message: 'Item name is required' });

  try {
    const result = await pool.query(
      `INSERT INTO checklist_items (trip_id, item_name, category, is_packed)
       VALUES ($1, $2, $3, false) RETURNING *`,
      [tripId, item_name, category || 'general']
    );
    res.status(201).json({ success: true, item: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;