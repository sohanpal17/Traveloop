const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const authMiddleware = require('../middleware/authMiddleware');
const { activityValidators } = require('../utils/validators');

// All routes require authentication
router.use(authMiddleware);

router.post('/', activityValidators.create, activityController.create);
router.get('/stop/:stopId', activityController.getActivitiesByStop);
router.get('/trip/:tripId', activityController.getActivitiesByTrip);
router.get('/trip/:tripId/summary', activityController.getActivitySummary);
router.get('/stop/:stopId/category', activityController.searchByCategory);
router.get('/:id', activityController.getActivityById);
router.put('/:id', activityController.updateActivity);
router.delete('/:id', activityController.deleteActivity);
router.patch('/:id/complete', activityController.markCompleted);

module.exports = router;