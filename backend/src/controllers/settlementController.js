const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Transaction, sequelize } = require('../models');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'settlement-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only images and PDF files are allowed'));
    }
  }
});

class SettlementController {
  // Upload settlement proof
  async uploadProof(req, res) {
    try {
      const { transactionId } = req.body;
      const userId = req.user.id;

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      // Verify transaction belongs to user
      const transaction = await Transaction.findOne({
        where: {
          id: transactionId,
          user_id: userId,
          status: 'pending'
        }
      });

      if (!transaction) {
        // Delete uploaded file
        fs.unlinkSync(req.file.path);
        return res.status(404).json({
          success: false,
          message: 'Transaction not found or already processed'
        });
      }

      // Create settlement proof record
      const fileUrl = `/uploads/${req.file.filename}`;
      
      // For now, we'll update transaction status to 'processing'
      // In production, you'd create a settlement_proofs record
      await transaction.update({
        status: 'processing'
      });

      res.json({
        success: true,
        data: {
          fileUrl,
          transactionId: transaction.id,
          message: 'Settlement proof uploaded successfully. Verification in progress.'
        }
      });

    } catch (error) {
      // Delete file if error occurred
      if (req.file && req.file.path) {
        fs.unlinkSync(req.file.path).catch(() => {});
      }
      
      console.error('Upload settlement proof error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upload settlement proof'
      });
    }
  }
}

module.exports = {
  controller: new SettlementController(),
  upload: upload.single('file')
};

