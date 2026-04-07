const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  let SystemUserPermission = sequelize.define('system_user_permissions', {

    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },

    permission_id: {
      allowNull: false,
      type: DataTypes.INTEGER
    },

    role_id: {
      allowNull: false,
      type: DataTypes.UUID
    },
    resource: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'e.g., content, task, team, workspace',
    },
    action: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'e.g., create, read, update, delete, move',
    },
    granted: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: 'true = granted, false = denied',
    },

  }, {
    tableName: 'system_user_permissions',
    timestamps: true // ✅ createdAt, updatedAt
  });

  // 🔗 Associations
  SystemUserPermission.associate = function (models) {

    // Permission relation
    // SystemUserPermission.belongsTo(models.permissions, {
    //   foreignKey: 'permission_id',
    //   as: 'permission'
    // });

    // Role relation
    SystemUserPermission.belongsTo(models.roles, {
      foreignKey: 'role_id',
      as: 'role'
    });

  };

  return SystemUserPermission;
};