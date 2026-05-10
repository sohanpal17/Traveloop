const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const { upload } = require('../utils/imageUpload');

// All routes require authentication
router.use(authMiddleware);

router.get('/profile', userController.getProfile);
router.put('/profile', upload.single('photo'), userController.updateProfile);
router.delete('/account', userController.deleteAccount);
router.get('/statistics', userController.getStatistics);

module.exports = router;