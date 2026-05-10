const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

router.post('/', noteController.create);
router.get('/trip/:tripId', noteController.getNotesByTrip);
router.get('/trip/:tripId/search', noteController.searchNotes);
router.get('/stop/:stopId', noteController.getNotesByStop);
router.get('/:id', noteController.getNoteById);
router.put('/:id', noteController.updateNote);
router.delete('/:id', noteController.deleteNote);

module.exports = router;