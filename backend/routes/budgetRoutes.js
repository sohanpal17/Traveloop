const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

router.post('/', budgetController.create);
router.get('/trip/:tripId', budgetController.getBudgetByTrip);
router.get('/trip/:tripId/summary', budgetController.getBudgetSummary);
router.get('/trip/:tripId/breakdown', budgetController.getCategoryBreakdown);
router.get('/trip/:tripId/daily', budgetController.getDailyBreakdown);
router.put('/:id', budgetController.updateBudget);
router.delete('/:id', budgetController.deleteBudget);

module.exports = router;