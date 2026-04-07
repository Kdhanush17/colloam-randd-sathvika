const { DataTypes } = require('sequelize');
const { USER_STATUS } = require('../../utils/constants');

module.exports = (sequelize) => {
  let UserAccount = sequelize.define('user_account', {

    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },

    userCode: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      // Removed primaryKey: true, as 'id' is already the primary key
      unique: true,
      allowNull: false,
    },
    verify_code: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    // ✅ Full Name instead of first/last
    full_name: {
      allowNull: false,
      type: DataTypes.STRING(255)
    },

    email: {
      allowNull: false,
      type: DataTypes.STRING(255),
      unique: true
    },

    password: {
      allowNull: false,
      type: DataTypes.TEXT
    },

    // 🔐 Password reset fields
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

    mobile_number: {
      allowNull: true,
      type: DataTypes.STRING(20)
    },

    // ✅ Workspace / Tenant DB
    workspace_name: {
      allowNull: true,
      type: DataTypes.STRING(255)
    },
    workspace_id: {
      allowNull: true,
      type: DataTypes.UUID,
    },

    tenant_db: {
      allowNull: true,
      type: DataTypes.STRING(255)
    },
    profile_picture_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },

    // ✅ Email verification
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    emailVerificationToken: {
      type: DataTypes.STRING(255)
    },

    // ✅ Subscription
    subscription_plan: {
      type: DataTypes.STRING(100),
      defaultValue: "FREE_TRIAL"
    },

    trial_start_date: {
      type: DataTypes.DATE
    },

    trial_end_date: {
      type: DataTypes.DATE
    },

    role_id: {
      allowNull: true,
      type: DataTypes.UUID
    },

    role_name: {
      allowNull: true,
      type: DataTypes.STRING(100),
      defaultValue: 'USER'
    },

    status: {
      allowNull: true,
      type: DataTypes.ENUM(...Object.values(USER_STATUS)),
      defaultValue: USER_STATUS.ACTIVE,
    },

    createdOn: {
      allowNull: true,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    last_login_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

  }, {
    tableName: 'user_account',
    timestamps: false
  });

  UserAccount.associate = function (models) {
    // UserAccount.belongsTo(models.roles, {
    //   foreignKey: 'role_id',
    //   as: 'roles'
    // });
    // UserAccount.hasOne(models.database_mappings, {
    //   foreignKey: "userCode",
    //   sourceKey: "userCode",
    //   as: "tenantMapping"
    // });
  };

  return UserAccount;
};