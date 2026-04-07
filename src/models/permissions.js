const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  let Permission = sequelize.define('permissions', {

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

    key: {
      allowNull: true,
      type: DataTypes.STRING(255)
    },

    status: {
      allowNull: true,
      type: DataTypes.BOOLEAN
    },

    createdBy: {
      allowNull: true,
      type: DataTypes.INTEGER
    },

    updatedBy: {
      allowNull: true,
      type: DataTypes.INTEGER
    },

    createdAt: {
      allowNull: true,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },

    updatedAt: {
      allowNull: true,
      type: DataTypes.DATE
    }

  }, {
    tableName: 'permissions',
    timestamps: false
  });

  Permission.associate = function (models) {
    // Permission.hasMany(models.system_user_permissions, {
    //   foreignKey: 'permission_id',
    //   as: 'systemUserPermissions'
    // });

  };

  return Permission;
};