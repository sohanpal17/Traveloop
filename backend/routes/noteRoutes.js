const express = require('express');
const router = express.Router({ mergeParams: true }); // access :tripId
const pool = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// GET all notes for a trip
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM notes WHERE trip_id = $1 ORDER BY updated_at DESC`,
      [req.params.tripId]
    );
    res.json({ success: true, notes: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create a note
router.post('/', async (req, res) => {
  const { content, stop_id } = req.body;
  if (!content) {
    return res.status(400).json({ success: false, message: 'Content is required' });
  }
  try {
    const result = await pool.query(
      `INSERT INTO notes (trip_id, stop_id, content)
       VALUES ($1, $2, $3) RETURNING *`,
      [req.params.tripId, stop_id || null, content]
    );
    res.status(201).json({ success: true, note: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update a note
router.put('/:noteId', async (req, res) => {
  const { content } = req.body;
  try {
    const result = await pool.query(
      `UPDATE notes SET content=$1, updated_at=NOW()
       WHERE id=$2 AND trip_id=$3 RETURNING *`,
      [content, req.params.noteId, req.params.tripId]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }
    res.json({ success: true, note: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE a note
router.delete('/:noteId', async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM notes WHERE id=$1 AND trip_id=$2 RETURNING id`,
      [req.params.noteId, req.params.tripId]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }
    res.json({ success: true, message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
