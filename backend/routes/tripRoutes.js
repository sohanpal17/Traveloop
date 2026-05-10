const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET: Fetch all trips
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM trips ORDER BY created_at DESC');
        res.status(200).json({ data: result.rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST: Create a new trip
router.post('/', async (req, res) => {
    const { title, description, start_date, end_date, user_id } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO trips (title, description, start_date, end_date, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [title, description || '', start_date || null, end_date || null, user_id]
        );
        res.status(201).json({ data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;