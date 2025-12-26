const { Transaction, Wallet, sequelize } = require('../models');
const { Sequelize } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

class TransactionController {
  // Create exchange transaction
  async createExchange(req, res) {
    const transaction = await sequelize.transaction();
    
    try {
      const { fromCurrency, toCurrency, fromAmount, exchangeRate } = req.body;
      const userId = req.user.id;

      // Calculate amounts
      const feePercentage = 0.015;
      const rawConversion = fromAmount * exchangeRate;
      const fee = rawConversion * feePercentage;
      const toAmount = rawConversion - fee;

      // Get or create wallets
      const fromWallet = await Wallet.findOrCreate({
        where: { user_id: userId, currency: fromCurrency.toUpperCase() },
        defaults: { balance: 0, is_crypto: false },
        transaction
      });

      const toWallet = await Wallet.findOrCreate({
        where: { user_id: userId, currency: toCurrency.toUpperCase() },
        defaults: { balance: 0, is_crypto: false },
        transaction
      });

      // Check balance
      if (fromWallet[0].balance < fromAmount) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'Insufficient balance'
        });
      }

      // Update wallets
      await fromWallet[0].update(
        { balance: Sequelize.literal(`balance - ${fromAmount}`) },
        { transaction }
      );

      await toWallet[0].update(
        { balance: Sequelize.literal(`balance + ${toAmount}`) },
        { transaction }
      );

      // Create transaction record
      const tx = await Transaction.create({
        user_id: userId,
        type: 'exchange',
        from_currency: fromCurrency.toUpperCase(),
        to_currency: toCurrency.toUpperCase(),
        from_amount: fromAmount,
        to_amount: toAmount,
        fee: fee,
        exchange_rate: exchangeRate,
        status: 'completed',
        reference_id: `PN-${uuidv4().substring(0, 9).toUpperCase()}`
      }, { transaction });

      await transaction.commit();

      res.status(201).json({
        success: true,
        data: {
          transaction: tx,
          fromBalance: fromWallet[0].balance - fromAmount,
          toBalance: toWallet[0].balance + toAmount
        }
      });

    } catch (error) {
      await transaction.rollback();
      console.error('Create exchange error:', error);
      res.status(500).json({
        success: false,
        message: 'Exchange failed'
      });
    }
  }

  // Create transfer transaction
  async createTransfer(req, res) {
    const transaction = await sequelize.transaction();
    
    try {
      const { recipient, amount, currency, transferType, speed } = req.body;
      const userId = req.user.id;

      // Calculate fee based on speed
      const fees = { instant: 2.99, fast: 0.99, standard: 0.00 };
      const fee = fees[speed] || 0;
      const totalAmount = parseFloat(amount) + fee;

      // Get wallet
      const wallet = await Wallet.findOne({
        where: { user_id: userId, currency: currency.toUpperCase() },
        transaction
      });

      if (!wallet) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: 'Wallet not found'
        });
      }

      // Check balance
      if (wallet.balance < totalAmount) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'Insufficient balance'
        });
      }

      // Create transaction (status pending until settlement proof verified)
      const tx = await Transaction.create({
        user_id: userId,
        type: 'transfer',
        from_currency: currency.toUpperCase(),
        from_amount: totalAmount,
        fee: fee,
        status: 'pending',
        counterparty: recipient,
        reference_id: `PN-${uuidv4().substring(0, 9).toUpperCase()}`
      }, { transaction });

      await transaction.commit();

      res.status(201).json({
        success: true,
        data: {
          transaction: tx,
          requiresSettlement: true
        }
      });

    } catch (error) {
      await transaction.rollback();
      console.error('Create transfer error:', error);
      res.status(500).json({
        success: false,
        message: 'Transfer failed'
      });
    }
  }

  // Get user transactions
  async getTransactions(req, res) {
    try {
      const { limit = 50, offset = 0 } = req.query;
      
      const transactions = await Transaction.findAndCountAll({
        where: { user_id: req.user.id },
        order: [['created_at', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      res.json({
        success: true,
        data: {
          transactions: transactions.rows,
          total: transactions.count
        }
      });
    } catch (error) {
      console.error('Get transactions error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch transactions'
      });
    }
  }

  // Get transaction by ID
  async getTransaction(req, res) {
    try {
      const { id } = req.params;
      const transaction = await Transaction.findOne({
        where: {
          id,
          user_id: req.user.id
        }
      });

      if (!transaction) {
        return res.status(404).json({
          success: false,
          message: 'Transaction not found'
        });
      }

      res.json({
        success: true,
        data: transaction
      });
    } catch (error) {
      console.error('Get transaction error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch transaction'
      });
    }
  }
}

module.exports = new TransactionController();

