const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  let superAdmin = sequelize.define('super_admins', {

    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },

    superAdminCode: {
      allowNull: false,
      type: DataTypes.STRING(100),
      unique: true
    },

    username: {
      allowNull: false,
      type: DataTypes.STRING(255)
    },

    email: {
      allowNull: false,
      type: DataTypes.STRING(255)
    },

    password: {
      allowNull: false,
      type: DataTypes.TEXT
    },

    resetPasswordToken: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "reset_password_token"
    },

    resetPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "reset_password_expires"
    },

    profilePic: {
      allowNull: true,
      type: DataTypes.TEXT
    },

    role_id: {
      allowNull: true,
      type: DataTypes.UUID
    },

    role_name: {
      allowNull: true,
      type: DataTypes.STRING(100),
      defaultValue: 'SUPER_ADMIN'
    },

    status: {
      allowNull: true,
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },

    website: {
      allowNull: true,
      type: DataTypes.STRING(255)
    },

    // 🔐 Flattened jwtToken object
    jwt_iv: {
      allowNull: true,
      type: DataTypes.TEXT
    },

    jwt_encryptedData: {
      allowNull: true,
      type: DataTypes.TEXT
    },

    phoneNumber: {
      allowNull: true,
      type: DataTypes.STRING(20)
    },

    company_name: {
      allowNull: true,
      type: DataTypes.STRING(255)
    },

    address: {
      allowNull: true,
      type: DataTypes.TEXT
    },

    created_by: {
      allowNull: true,
      type: DataTypes.INTEGER
    },

    updated_by: {
      allowNull: true,
      type: DataTypes.INTEGER
    },

    created_at: {
      allowNull: true,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },

    updated_at: {
      allowNull: true,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }

  }, {
    tableName: 'super_admins',
    timestamps: false
  });

  // 🔗 Associations
  superAdmin.associate = function (models) {
    superAdmin.belongsTo(models.roles, {
      foreignKey: 'role_id',
      as: 'roles'
    });
  };

  return superAdmin;
};