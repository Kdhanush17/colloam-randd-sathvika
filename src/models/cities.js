const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  let Cities = sequelize.define('cities', {

    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },

    category: {
      allowNull: false,
      type: DataTypes.STRING(255)
    },

    values: {
      allowNull: false,
      type: DataTypes.JSONB // ✅ array of cities
    }

  }, {
    tableName: 'cities',
    timestamps: true
  });

  return Cities;
};