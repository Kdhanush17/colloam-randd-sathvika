const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  let SystemSettings = sequelize.define('system_settings', {

    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },

    module: {
      allowNull: true,
      type: DataTypes.STRING(255)
    },

    key: {
      allowNull: true,
      type: DataTypes.STRING(255)
    },

    value: {
      allowNull: true,
      type: DataTypes.STRING(255)
    }

  }, {
    tableName: 'system_settings',
    timestamps: false
  });

  return SystemSettings;
};