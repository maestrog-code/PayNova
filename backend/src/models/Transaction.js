const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Transaction = sequelize.define('Transaction', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    from_currency: {
      type: DataTypes.STRING(10)
    },
    to_currency: {
      type: DataTypes.STRING(10)
    },
    from_amount: {
      type: DataTypes.DECIMAL(20, 8)
    },
    to_amount: {
      type: DataTypes.DECIMAL(20, 8)
    },
    fee: {
      type: DataTypes.DECIMAL(20, 8),
      defaultValue: 0
    },
    exchange_rate: {
      type: DataTypes.DECIMAL(20, 8)
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: 'pending'
    },
    counterparty: {
      type: DataTypes.STRING
    },
    reference_id: {
      type: DataTypes.STRING(100),
      unique: true
    }
  }, {
    tableName: 'transactions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Transaction;
};

