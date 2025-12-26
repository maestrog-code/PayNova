const { Wallet, Transaction } = require('../models');
const { Op } = require('sequelize');

class WalletController {
  // Get user wallets
  async getWallets(req, res) {
    try {
      const wallets = await Wallet.findAll({
        where: { user_id: req.user.id },
        order: [['created_at', 'ASC']]
      });

      res.json({
        success: true,
        data: wallets
      });
    } catch (error) {
      console.error('Get wallets error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch wallets'
      });
    }
  }

  // Get wallet by currency
  async getWalletByCurrency(req, res) {
    try {
      const { currency } = req.params;
      const wallet = await Wallet.findOne({
        where: {
          user_id: req.user.id,
          currency: currency.toUpperCase()
        }
      });

      if (!wallet) {
        return res.status(404).json({
          success: false,
          message: 'Wallet not found'
        });
      }

      res.json({
        success: true,
        data: wallet
      });
    } catch (error) {
      console.error('Get wallet error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch wallet'
      });
    }
  }
}

module.exports = new WalletController();

