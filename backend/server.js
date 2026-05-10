const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./config/db');

const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.use('/api/auth',  require('./routes/authRoutes'));
app.use('/api/trips', require('./routes/tripRoutes'));
app.use('/api/trips/:tripId/stops',      require('./routes/stopRoutes'));
app.use('/api/stops/:stopId/activities', require('./routes/activityRoutes'));
app.use('/api/trips/:tripId/checklist',  require('./routes/checklistRoutes'));
app.use('/api/trips/:tripId/notes',      require('./routes/noteRoutes'));
app.use('/api/public', require('./routes/publicRoutes'));

app.get('/', (req, res) => res.send('Traveloop API running'));

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});