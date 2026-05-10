const express = require('express');
const router = express.Router();
const cityController = require('../controllers/cityController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.get('/search', cityController.searchCities);
router.get('/popular', cityController.getPopularCities);
router.get('/all', cityController.getAllCities);
router.get('/country/:country', cityController.getCitiesByCountry);
router.get('/region/:region', cityController.getCitiesByRegion);
router.get('/:id', cityController.getCityById);

// Protected routes
router.post('/save', authMiddleware, cityController.saveDestination);
router.get('/saved/list', authMiddleware, cityController.getSavedDestinations);
router.delete('/saved/:cityId', authMiddleware, cityController.removeSavedDestination);

module.exports = router;