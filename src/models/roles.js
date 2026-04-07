const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  let Role = sequelize.define('roles', {

    role_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },

    role: {
      allowNull: false,
      type: DataTypes.STRING(255)
    },
    workspace_id: {
      type: DataTypes.UUID,
      // allowNull: false,
      references: {
        model: 'workspaces',
        key: 'workspace_id',
      },
      index: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    tenant_id: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    status: {
      allowNull: true,
      type: DataTypes.ENUM('ACTIVE', 'DEACTIVE'),
      defaultValue: 'ACTIVE'
    },

    createdBy: {
      allowNull: true,
      type: DataTypes.INTEGER
    },

    updatedBy: {
      allowNull: true,
      type: DataTypes.INTEGER
    }

  }, {
    tableName: 'roles',
    timestamps: true
  });

  // 🔗 Associations
  Role.associate = function (models) {

    // Role.hasMany(models.super_admins, {
    //   foreignKey: 'id',
    //   as: 'superAdmins'
    // });

    // Role.hasMany(models.admins, {
    //   foreignKey: 'id',
    //   as: 'admins'
    // });
  };


  return Role;
};