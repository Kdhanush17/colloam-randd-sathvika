const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  let Skills = sequelize.define('skills', {

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
      type: DataTypes.JSONB // ✅ Array of strings
    }

  }, {
    tableName: 'skills',
    timestamps: true
  });

  return Skills;
};