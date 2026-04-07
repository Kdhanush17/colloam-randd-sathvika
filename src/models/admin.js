const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  let admin = sequelize.define('admins', {

    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },

    adminName: {
      allowNull: false,
      type: DataTypes.STRING(255)
    },

    adminCode: {
      allowNull: true,
      type: DataTypes.STRING(100)
    },

    CompanyId: {
      allowNull: true,
      type: DataTypes.STRING(100)
    },

    superAdminId: {
      allowNull: false,
      type: DataTypes.STRING(100)
    },

    superAdminCode: {
      allowNull: true,
      type: DataTypes.STRING(100)
    },

    adminEmail: {
      allowNull: true,
      type: DataTypes.STRING(255)
    },

    adminPassword: {
      allowNull: false,
      type: DataTypes.TEXT
    },

    adminCompany: {
      allowNull: true,
      type: DataTypes.STRING(255)
    },

    companyWebsite: {
      allowNull: true,
      type: DataTypes.STRING(255)
    },

    adminAddress: {
      allowNull: true,
      type: DataTypes.TEXT
    },

    phoneNumber: {
      allowNull: true,
      type: DataTypes.STRING(20)
    },

    profilePic: {
      allowNull: true,
      type: DataTypes.TEXT
    },

    role_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'roles',
        key: 'role_id'
      },
    },

    role_name: {
      allowNull: true,
      type: DataTypes.STRING(100),
      defaultValue: 'ADMIN'
    },

    status: {
      allowNull: true,
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },

    created_by: {
      allowNull: true,
      type: DataTypes.INTEGER
    },

    updated_by: {
      allowNull: true,
      type: DataTypes.INTEGER
    },

    createdat: {
      allowNull: true,
      type: DataTypes.DATE
    },

    updatedat: {
      allowNull: true,
      type: DataTypes.DATE
    }

  }, {
    tableName: 'admins',
    timestamps: false
  });

  // 🔗 Associations
  admin.associate = function (models) {
    admin.belongsTo(models.roles, {
      foreignKey: 'role_id',
      as: 'roles'
    });
  };

  return admin;
};