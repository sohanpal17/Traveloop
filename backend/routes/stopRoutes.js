const express = require('express');
const router = express.Router({ mergeParams: true }); // allows access to :tripId
const pool = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// GET all stops for a trip
router.get('/', async (req, res) => {
  try {
    const { tripId } = req.params;
    const result = await pool.query(
      `SELECT * FROM stops WHERE trip_id = $1 ORDER BY order_index ASC`,
      [tripId]
    );
    res.json({ success: true, stops: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET a single stop
router.get('/:stopId', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM stops WHERE id = $1 AND trip_id = $2`,
      [req.params.stopId, req.params.tripId]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ success: false, message: 'Stop not found' });
    }
    res.json({ success: true, stop: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create a stop
router.post('/', async (req, res) => {
  const { tripId } = req.params;
  const { city, country, start_date, end_date, duration_days, notes, order_index } = req.body;
  if (!city || !country) {
    return res.status(400).json({ success: false, message: 'City and country are required' });
  }
  try {
    const result = await pool.query(
      `INSERT INTO stops (trip_id, city, country, start_date, end_date, duration_days, notes, order_index)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [tripId, city, country, start_date || null, end_date || null, duration_days || null, notes || null, order_index || 0]
    );
    res.status(201).json({ success: true, stop: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update a stop
router.put('/:stopId', async (req, res) => {
  const { city, country, start_date, end_date, duration_days, notes, order_index } = req.body;
  try {
    const result = await pool.query(
      `UPDATE stops
       SET city=$1, country=$2, start_date=$3, end_date=$4,
           duration_days=$5, notes=$6, order_index=$7
       WHERE id=$8 AND trip_id=$9
       RETURNING *`,
      [city, country, start_date, end_date, duration_days, notes, order_index, req.params.stopId, req.params.tripId]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ success: false, message: 'Stop not found' });
    }
    res.json({ success: true, stop: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE a stop
router.delete('/:stopId', async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM stops WHERE id=$1 AND trip_id=$2 RETURNING id`,
      [req.params.stopId, req.params.tripId]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ success: false, message: 'Stop not found' });
    }
    res.json({ success: true, message: 'Stop deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;