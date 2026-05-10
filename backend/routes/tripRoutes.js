const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const authMiddleware = require('../middleware/authMiddleware');
const { tripValidators } = require('../utils/validators');
const { upload } = require('../utils/imageUpload');

// Protected routes (require authentication)
router.use(authMiddleware);

// Trip CRUD
router.post('/', upload.single('cover_photo'), tripValidators.create, tripController.create);
router.get('/', tripController.getAllTrips);
router.get('/recent', tripController.getRecentTrips);
router.get('/:id', tripController.getTripById);
router.put('/:id', upload.single('cover_photo'), tripValidators.update, tripController.updateTrip);
router.delete('/:id', tripController.deleteTrip);

// Trip statistics
router.get('/:id/statistics', tripController.getTripStatistics);

// Public/Private toggle
router.post('/:id/make-public', tripController.makePublic);
router.post('/:id/make-private', tripController.makePrivate);

// Public routes (no auth required)
router.get('/public/:slug', tripController.getPublicTrip);
router.post('/public/:slug/copy', authMiddleware, tripController.copyTrip);

module.exports = router;