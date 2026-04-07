const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  const DeviceLogin = sequelize.define('device_login', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },

    device_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
      allowNull: false,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'user_account',
        key: 'id',
      },
    },

    userCode: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    // Device Information
    device_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'e.g., Chrome, Safari, Firefox, Edge'
    },

    device_type: {
      type: DataTypes.ENUM('mobile', 'tablet', 'desktop', 'unknown'),
      defaultValue: 'unknown',
      allowNull: false,
    },

    // Browser Information
    browser_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    browser_version: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    // OS Information
    os_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },

    os_version: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    // Network Information
    ip_address: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },

    user_agent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    // Location (if available through IP geolocation)
    country: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    city: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    // Session tracking
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    device_token: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    // Timestamps
    last_login_at: {
      type: DataTypes.DATE,
      allowNull: true,
      
    },

    last_activity_at: {
      type: DataTypes.DATE,
      allowNull: true,
    
    },

    login_count: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      
    },

    createdOn: {
      allowNull: true,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
     
    },

    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

  }, {
    tableName: 'device_login',
    timestamps: false,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['userCode'] },
      { fields: ['ip_address'] },
      { fields: ['last_login_at'] },
      { fields: ['user_id', 'is_active'] },
    ]
  });

  DeviceLogin.associate = function (models) {
    if (models.user_account) {
      DeviceLogin.belongsTo(models.user_account, {
        foreignKey: 'user_id',
        as: 'user'
      });
    }
  };

  return DeviceLogin;
};
