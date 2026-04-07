const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  let Tax = sequelize.define('tax', {

    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },

    tax_name: {
      allowNull: false,
      type: DataTypes.STRING(255)
    },

    type: {
      allowNull: false,
      type: DataTypes.ENUM('PERCENTAGE', 'FIXED')
    },

    value: {
      allowNull: false,
      type: DataTypes.FLOAT
    },

    // 🌍 Global tax mapping
    country_code: {
      allowNull: false,
      type: DataTypes.STRING(10)
    },

    state: {
      allowNull: true,
      type: DataTypes.STRING(100)
    },

    description: {
      allowNull: true,
      type: DataTypes.TEXT
    },

    active: {
      allowNull: true,
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },

    created_by: {
      allowNull: true,
      type: DataTypes.STRING(100)
    },

    updated_by: {
      allowNull: true,
      type: DataTypes.STRING(100)
    },

    createdat: {
      allowNull: true,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },

    updatedat: {
      allowNull: true,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }

  }, {
    tableName: 'tax',
    timestamps: false
  });

  return Tax;
};