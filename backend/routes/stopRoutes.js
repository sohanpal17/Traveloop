const express = require('express');
const router = express.Router();
const stopController = require('../controllers/stopController');
const authMiddleware = require('../middleware/authMiddleware');
const { stopValidators } = require('../utils/validators');

// All routes require authentication
router.use(authMiddleware);

router.post('/', stopValidators.create, stopController.create);
router.get('/trip/:tripId', stopController.getStopsByTrip);
router.get('/:id', stopController.getStopById);
router.put('/:id', stopController.updateStop);
router.delete('/:id', stopController.deleteStop);
router.post('/trip/:tripId/reorder', stopController.reorderStops);

module.exports = router;