const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./config/db');

const app = express();

// 1. MIDDLEWARE (Must come first!)
app.use(cors({ 
    origin: 'http://localhost:3000',
    credentials: true 
}));
app.use(express.json()); // Parses incoming JSON requests

// 2. ROUTES
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/trips', require('./routes/tripRoutes'));
app.use('/api/trips/:tripId/stops', require('./routes/stopRoutes'));
app.use('/api/stops/:stopId/activities', require('./routes/activityRoutes'));
app.use('/api/trips/:tripId/checklist', require('./routes/checklistRoutes'));
app.use('/api/trips/:tripId/notes', require('./routes/noteRoutes'));
app.use('/api/public', require('./routes/publicRoutes'));

// 3. BASE ROUTE
app.get('/', (req, res) => res.send('Traveloop API running'));

// 4. START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});