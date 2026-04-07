const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
const NotificationPreference = sequelize.define(
  'NotificationPreference',
  {
    preference_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'user_account',
        key: 'userCode',
      },
      index: true,
    },
    workspace_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'workspaces',
        key: 'workspace_id',
      },
    },
    notification_type: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'null = global setting',
    },
    in_app_enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    email_enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    frequency: {
      type: DataTypes.ENUM('instant', 'daily', 'weekly', 'never'),
      defaultValue: 'instant',
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'notification_preferences',
    timestamps: false,
    indexes: [
      { fields: ['user_id', 'workspace_id'] },
    ],
  }
);

return NotificationPreference
}
