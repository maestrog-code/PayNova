const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router.get('/', walletController.getWallets.bind(walletController));
router.get('/:currency', walletController.getWalletByCurrency.bind(walletController));

module.exports = router;

