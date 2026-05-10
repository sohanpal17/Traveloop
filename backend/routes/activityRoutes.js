const express = require('express');
const router = express.Router({ mergeParams: true }); // access :stopId
const pool = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// GET all activities for a stop
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM activities WHERE stop_id = $1 ORDER BY date ASC, time ASC`,
      [req.params.stopId]
    );
    res.json({ success: true, activities: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET a single activity
router.get('/:activityId', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM activities WHERE id = $1 AND stop_id = $2`,
      [req.params.activityId, req.params.stopId]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }
    res.json({ success: true, activity: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create an activity
router.post('/', async (req, res) => {
  const { title, description, category, estimated_cost, date, time } = req.body;
  if (!title) {
    return res.status(400).json({ success: false, message: 'Title is required' });
  }
  try {
    const result = await pool.query(
      `INSERT INTO activities (stop_id, title, description, category, estimated_cost, date, time)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [req.params.stopId, title, description || null, category || null, estimated_cost || null, date || null, time || null]
    );
    res.status(201).json({ success: true, activity: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update an activity
router.put('/:activityId', async (req, res) => {
  const { title, description, category, estimated_cost, date, time } = req.body;
  try {
    const result = await pool.query(
      `UPDATE activities
       SET title=$1, description=$2, category=$3, estimated_cost=$4, date=$5, time=$6
       WHERE id=$7 AND stop_id=$8
       RETURNING *`,
      [title, description, category, estimated_cost, date, time, req.params.activityId, req.params.stopId]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }
    res.json({ success: true, activity: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE an activity
router.delete('/:activityId', async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM activities WHERE id=$1 AND stop_id=$2 RETURNING id`,
      [req.params.activityId, req.params.stopId]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }
    res.json({ success: true, message: 'Activity deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
