const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
const StorageQuotaNotification = sequelize.define(
  'StorageQuotaNotification',
  {
    notification_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    workspace_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'workspaces',
        key: 'workspace_id',
      },
      index: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'user_account',
        key: 'userCode',
      },
    },
    threshold_percentage: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Percentage threshold (50, 75, 90, 100)',
    },
    notification_type: {
      type: DataTypes.ENUM('warning', 'critical', 'limit_reached'),
      allowNull: false,
    },
    sent_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    read_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'storage_quota_notifications',
    timestamps: false,
    indexes: [
      { fields: ['workspace_id', 'user_id', 'notification_type'], name: 'idx_sqn_workspace_user_type' },
      { fields: ['workspace_id', 'threshold_percentage'], name: 'idx_sqn_workspace_threshold' },
      { fields: ['sent_at'], name: 'idx_sqn_sent_at' },
    ],
  }
);

return StorageQuotaNotification
}
