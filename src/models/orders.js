const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  let Order = sequelize.define('order_details', {

    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },

    orderID: {
      allowNull: true,
      type: DataTypes.STRING(100)
    },

    merchantTransactionId: {
      allowNull: true,
      type: DataTypes.STRING(255)
    },

    userId: {
      allowNull: true,
      type: DataTypes.INTEGER
    },

    currencyCode: {
      allowNull: true,
      type: DataTypes.STRING(10)
    },

    email: {
      allowNull: true,
      type: DataTypes.STRING(255),
      defaultValue: null
    },

    total: {
      allowNull: true,
      type: DataTypes.DECIMAL(10, 2) // ✅ fixed (was Number)
    },

    orderStatus: {
      allowNull: true,
      type: DataTypes.ENUM(
        'PAYMENT_INPROGRESS',
        'PAYMENT_COMPLETED',
        'PAYMENT_CANCELLED',
        'PAYMENT_FAILED'
      ),
      defaultValue: 'PAYMENT_INPROGRESS'
    },

    phonePeyOrderId: {
      allowNull: true,
      type: DataTypes.STRING(255)
    },

    phonePeyPaymentId: {
      allowNull: true,
      type: DataTypes.STRING(255)
    },

    createdTime: {
      allowNull: true,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }

  }, {
    tableName: 'order_details',
    timestamps: false
  });

  // 🔗 Associations
  Order.associate = function (models) {

    Order.belongsTo(models.user_account, {
      foreignKey: 'id',
      as: 'user'
    });

  };

  return Order;
};