const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const { User, Wallet } = require('../models');

class AuthController {
  // Sign Up
  async signup(req, res) {
    try {
      const { email, password, full_name } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already registered'
        });
      }

      // Hash password
      const password_hash = await bcrypt.hash(password, 12);

      // Create user
      const user = await User.create({
        email,
        password_hash,
        full_name
      });

      // Create default wallets
      const currencies = ['USD', 'EUR', 'BTC', 'ETH'];
      for (const currency of currencies) {
        await Wallet.create({
          user_id: user.id,
          currency,
          balance: 0,
          is_crypto: ['BTC', 'ETH'].includes(currency)
        });
      }

      res.status(201).json({
        success: true,
        message: 'Account created successfully',
        data: {
          userId: user.id,
          email: user.email
        }
      });

    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({
        success: false,
        message: 'Registration failed'
      });
    }
  }

  // Sign In
  async signin(req, res) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Check password
      const isValid = await bcrypt.compare(password, user.password_hash);
      if (!isValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Check if 2FA is enabled
      if (user.is_2fa_enabled) {
        const tempToken = jwt.sign(
          { id: user.id, type: '2fa_pending' },
          process.env.JWT_SECRET,
          { expiresIn: '5m' }
        );

        return res.json({
          success: true,
          requires2FA: true,
          tempToken
        });
      }

      // Generate tokens
      const token = this.generateToken(user.id);
      const refreshToken = this.generateRefreshToken(user.id);

      // Update last login
      await user.update({ last_login: new Date() });

      res.json({
        success: true,
        data: {
          token,
          refreshToken,
          user: {
            id: user.id,
            email: user.email,
            full_name: user.full_name
          }
        }
      });

    } catch (error) {
      console.error('Signin error:', error);
      res.status(500).json({
        success: false,
        message: 'Login failed'
      });
    }
  }

  // Setup 2FA
  async setup2FA(req, res) {
    try {
      const user = req.user;

      // Generate secret
      const secret = speakeasy.generateSecret({
        name: `PayNova (${user.email})`,
        issuer: 'PayNova'
      });

      // Generate QR code
      const qrCode = await QRCode.toDataURL(secret.otpauth_url);

      // Save secret (temporarily)
      await user.update({ totp_secret: secret.base32 });

      res.json({
        success: true,
        data: {
          secret: secret.base32,
          qrCode
        }
      });

    } catch (error) {
      console.error('2FA setup error:', error);
      res.status(500).json({
        success: false,
        message: '2FA setup failed'
      });
    }
  }

  // Verify 2FA
  async verify2FA(req, res) {
    try {
      const { token, tempToken } = req.body;

      // Verify temp token
      const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
      
      const user = await User.findByPk(decoded.id);

      // Verify TOTP code
      const verified = speakeasy.totp.verify({
        secret: user.totp_secret,
        encoding: 'base32',
        token,
        window: 2
      });

      if (!verified) {
        return res.status(401).json({
          success: false,
          message: 'Invalid 2FA code'
        });
      }

      // Enable 2FA if first time
      if (!user.is_2fa_enabled) {
        await user.update({ is_2fa_enabled: true });
      }

      // Generate real tokens
      const authToken = this.generateToken(user.id);
      const refreshToken = this.generateRefreshToken(user.id);

      res.json({
        success: true,
        data: {
          token: authToken,
          refreshToken,
          user: {
            id: user.id,
            email: user.email,
            full_name: user.full_name
          }
        }
      });

    } catch (error) {
      console.error('2FA verify error:', error);
      res.status(500).json({
        success: false,
        message: '2FA verification failed'
      });
    }
  }

  // Helper: Generate JWT
  generateToken(userId) {
    return jwt.sign(
      { id: userId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
  }

  // Refresh Token
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          message: 'Refresh token is required'
        });
      }

      // Verify refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      
      // Get user
      const user = await User.findByPk(decoded.id);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      // Generate new tokens
      const newToken = this.generateToken(user.id);
      const newRefreshToken = this.generateRefreshToken(user.id);

      res.json({
        success: true,
        data: {
          token: newToken,
          refreshToken: newRefreshToken
        }
      });

    } catch (error) {
      console.error('Refresh token error:', error);
      res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token'
      });
    }
  }

  // Helper: Generate Refresh Token
  generateRefreshToken(userId) {
    return jwt.sign(
      { id: userId },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
    );
  }
}

module.exports = new AuthController();

