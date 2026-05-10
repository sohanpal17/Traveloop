const express = require('express');
const router = express.Router();
const packingController = require('../controllers/packingController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

router.post('/', packingController.create);
router.get('/trip/:tripId', packingController.getPackingByTrip);
router.get('/trip/:tripId/category/:category', packingController.getPackingByCategory);
router.get('/trip/:tripId/summary', packingController.getPackingSummary);
router.put('/:id', packingController.updatePacking);
router.patch('/:id/toggle', packingController.togglePacked);
router.delete('/:id', packingController.deletePacking);
router.post('/trip/:tripId/reset', packingController.resetAll);

module.exports = router;