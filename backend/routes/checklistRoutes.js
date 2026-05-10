const express = require('express');
const router = express.Router({ mergeParams: true }); // access :tripId
const pool = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// GET all checklist items for a trip
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM checklist_items WHERE trip_id = $1 ORDER BY category, created_at ASC`,
      [req.params.tripId]
    );
    res.json({ success: true, items: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST add a checklist item
router.post('/', async (req, res) => {
  const { label, category } = req.body;
  if (!label) {
    return res.status(400).json({ success: false, message: 'Label is required' });
  }
  try {
    const result = await pool.query(
      `INSERT INTO checklist_items (trip_id, label, category, is_packed)
       VALUES ($1, $2, $3, false) RETURNING *`,
      [req.params.tripId, label, category || 'general']
    );
    res.status(201).json({ success: true, item: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH toggle is_packed
router.patch('/:itemId', async (req, res) => {
  const { is_packed } = req.body;
  try {
    const result = await pool.query(
      `UPDATE checklist_items SET is_packed=$1 WHERE id=$2 AND trip_id=$3 RETURNING *`,
      [is_packed, req.params.itemId, req.params.tripId]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    res.json({ success: true, item: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE a checklist item
router.delete('/:itemId', async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM checklist_items WHERE id=$1 AND trip_id=$2 RETURNING id`,
      [req.params.itemId, req.params.tripId]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    res.json({ success: true, message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;