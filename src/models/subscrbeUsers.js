const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  let Subscription = sequelize.define('subscriptions', {

    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },

    adminEmail: {
      allowNull: false,
      type: DataTypes.STRING(255)
    },

    planCode: {
      allowNull: false,
      type: DataTypes.STRING(100)
    },

    planName: {
      allowNull: true,
      type: DataTypes.STRING(255)
    },

    recruiterLimit: {
      allowNull: true,
      type: DataTypes.INTEGER
    },

    planDuration: {
      allowNull: true,
      type: DataTypes.INTEGER // months
    },

    status: {
      allowNull: true,
      type: DataTypes.ENUM('ACTIVE', 'EXPIRED', 'CANCELLED'),
      defaultValue: 'ACTIVE'
    },

    startDate: {
      allowNull: true,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },

    endDate: {
      allowNull: true,
      type: DataTypes.DATE
    },

    jobLimitPerWeek: {
      allowNull: true,
      type: DataTypes.INTEGER
    },

    // 💳 Payment Details (Flattened)
    payment_method: {
      allowNull: true,
      type: DataTypes.STRING(100)
    },

    transactionId: {
      allowNull: true,
      type: DataTypes.STRING(255)
    },

    paymentDate: {
      allowNull: true,
      type: DataTypes.DATE
    },

    paymentStatus: {
      allowNull: true,
      type: DataTypes.ENUM('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'),
      defaultValue: 'PENDING'
    }

  }, {
    tableName: 'subscriptions',
    timestamps: true // ✅ createdAt, updatedAt
  });

  return Subscription;
};