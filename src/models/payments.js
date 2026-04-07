const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  let Payment = sequelize.define('payments', {

    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },

    userId: {
      allowNull: true,
      type: DataTypes.INTEGER
    },

    planCode: {
      allowNull: true,
      type: DataTypes.STRING(100)
    },

    planName: {
      allowNull: true,
      type: DataTypes.STRING(255)
    },

    amount: {
      allowNull: true,
      type: DataTypes.DECIMAL(10, 2) // ✅ fixed (was string)
    },

    currency: {
      allowNull: true,
      type: DataTypes.STRING(10)
    },

    status: {
      allowNull: true,
      type: DataTypes.ENUM('pending', 'succeeded', 'failed'),
      defaultValue: 'pending'
    },

    stripePaymentIntentId: {
      allowNull: true,
      type: DataTypes.STRING(255)
    },

    endDate: {
      allowNull: true,
      type: DataTypes.DATE
    }

  }, {
    tableName: 'payments',
    timestamps: true // ✅ createdAt, updatedAt
  });

  // 🔗 Associations
  Payment.associate = function (models) {

    // Payment.belongsTo(models.recruiter, {
    //   foreignKey: 'userId',
    //   as: 'user'
    // });

  };

  return Payment;
};