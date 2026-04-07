const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  let Contact = sequelize.define('contacts', {

    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },

    name: {
      allowNull: true,
      type: DataTypes.STRING(255)
    },

    email: {
      allowNull: true,
      type: DataTypes.STRING(255)
    },

    phoneno: {
      allowNull: true,
      type: DataTypes.STRING(20)
    },

    subject: {
      allowNull: true,
      type: DataTypes.STRING(255)
    },

    message: {
      allowNull: true,
      type: DataTypes.TEXT
    }

  }, {
    tableName: 'contacts',
    timestamps: true // ✅ createdAt, updatedAt
  });

  return Contact;
};