const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router.get('/', transactionController.getTransactions.bind(transactionController));
router.get('/:id', transactionController.getTransaction.bind(transactionController));
router.post('/exchange', transactionController.createExchange.bind(transactionController));
router.post('/transfer', transactionController.createTransfer.bind(transactionController));

module.exports = router;

