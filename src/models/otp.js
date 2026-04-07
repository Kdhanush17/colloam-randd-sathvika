const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  let Otp = sequelize.define('otp', {

    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },

    phone_number: {
      allowNull: true,
      type: DataTypes.STRING(20)
    },

    email: {
      allowNull: true,
      type: DataTypes.STRING(255)
    },

    name: {
      allowNull: true,
      type: DataTypes.STRING(255)
    },

    isVerified: {
      allowNull: true,
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    otp: {
      allowNull: true,
      type: DataTypes.STRING(10)
    },

    loginotp: {
      allowNull: true,
      type: DataTypes.STRING(10)
    }

  }, {
    tableName: 'otp',
    timestamps: true // ✅ createdAt, updatedAt
  });

  return Otp;
};