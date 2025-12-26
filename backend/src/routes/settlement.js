const express = require('express');
const router = express.Router();
const { controller: settlementController, upload } = require('../controllers/settlementController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router.post('/upload', upload, settlementController.uploadProof.bind(settlementController));

module.exports = router;

