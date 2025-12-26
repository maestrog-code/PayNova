const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/signup', authController.signup.bind(authController));
router.post('/signin', authController.signin.bind(authController));
router.post('/verify-2fa', authController.verify2FA.bind(authController));
router.post('/refresh', authController.refreshToken.bind(authController));

// Protected routes
router.post('/setup-2fa', protect, authController.setup2FA.bind(authController));

module.exports = router;

