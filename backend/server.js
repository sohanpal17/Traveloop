const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const tripRoutes = require('./routes/tripRoutes');
const stopRoutes = require('./routes/stopRoutes');
const activityRoutes = require('./routes/activityRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const packingRoutes = require('./routes/packingRoutes');
const noteRoutes = require('./routes/noteRoutes');
const cityRoutes = require('./routes/cityRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/stops', stopRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/packing', packingRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Traveloop API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API documentation endpoint
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Traveloop API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      trips: '/api/trips',
      stops: '/api/stops',
      activities: '/api/activities',
      budget: '/api/budget',
      packing: '/api/packing',
      notes: '/api/notes',
      cities: '/api/cities',
      users: '/api/users'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Multer file upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File size too large. Maximum size is 5MB.'
    });
  }
  
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      message: 'Unexpected file field'
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 Traveloop API Server`);
  console.log('='.repeat(50));
  console.log(`📡 Server running on port: ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📝 API Documentation: http://localhost:${PORT}/api`);
  console.log(`💚 Health Check: http://localhost:${PORT}/health`);
  console.log('='.repeat(50));
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

module.exports = app;