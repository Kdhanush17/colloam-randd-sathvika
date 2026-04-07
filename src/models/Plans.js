const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  let Plans = sequelize.define('plans', {

    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },

    planCode: {
      allowNull: false,
      type: DataTypes.STRING(100)
    },

    planName: {
      allowNull: false,
      type: DataTypes.STRING(255)
    },

    regularPrice: {
      allowNull: false,
      type: DataTypes.DECIMAL(10, 2) // ✅ better than string
    },

    salePrice: {
      allowNull: false,
      type: DataTypes.DECIMAL(10, 2)
    },

    planDescription: {
      allowNull: false,
      type: DataTypes.TEXT
    },

    planFeatures: {
      allowNull: false,
      type: DataTypes.TEXT // or JSONB (see below)
    },

    planIcon: {
      allowNull: false,
      type: DataTypes.STRING(255)
    },

    recruiterLimit: {
      allowNull: true,
      type: DataTypes.INTEGER,
      defaultValue: 0
    },

    planDuration: {
      allowNull: false,
      type: DataTypes.INTEGER // months
    },

    planDisplay: {
      allowNull: true,
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },

    planType: {
      allowNull: true,
      type: DataTypes.ENUM('FREE', 'PAID'),
      defaultValue: 'FREE'
    },

    isPopular: {
      allowNull: true,
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    created_by: {
      allowNull: true,
      type: DataTypes.STRING(100)
    },

    updated_by: {
      allowNull: true,
      type: DataTypes.STRING(100)
    },

    planStatus: {
      allowNull: true,
      type: DataTypes.ENUM('ACTIVE', 'DEACTIVE'),
      defaultValue: 'ACTIVE'
    }

  }, {
    tableName: 'plans',
    timestamps: true // ✅ createdAt, updatedAt auto handled
  });

  return Plans;
};