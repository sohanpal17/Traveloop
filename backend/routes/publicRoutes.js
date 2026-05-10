const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET public trips (no auth required)
router.get('/trips', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.id, t.title, t.description, t.start_date, t.end_date, u.name as author
       FROM trips t
       JOIN users u ON t.user_id = u.id
       WHERE t.is_public = true
       ORDER BY t.created_at DESC
       LIMIT 20`
    );
    res.json({ success: true, trips: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;