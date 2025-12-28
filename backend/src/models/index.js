const cors = require('cors');

// This allows ALL websites to talk to your backend (Good for a quick fix)
app.use(cors()); 

// OR: This only allows YOUR frontend to talk to it (Better for security)
// app.use(cors({ origin: 'https://your-frontend-url.run.app' }));const { sequelize } = require('../config/database');

// Import models
const User = require('./User')(sequelize);
const Wallet = require('./Wallet')(sequelize);
const Transaction = require('./Transaction')(sequelize);

// Set up associations
User.hasMany(Wallet, { foreignKey: 'user_id', as: 'wallets' });
Wallet.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(Transaction, { foreignKey: 'user_id', as: 'transactions' });
Transaction.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = {
  sequelize,
  User,
  Wallet,
  Transaction
};

