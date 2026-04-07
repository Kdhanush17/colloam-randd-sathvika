const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
const Notification = sequelize.define(
  'Notification',
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
      index: true,
    },
    type: {
      type: DataTypes.ENUM(
        'task_assigned',
        'content_status_change',
        'comment_mention',
        'due_date_reminder',
        'team_member_joined',
        'storage_warning',
        'workflow_complete',
        'system'
      ),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    related_id: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'ID of related content/task/etc',
    },
    related_type: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Type of related object (content, task, etc)',
    },
    read_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'notifications',
    timestamps: false,
    indexes: [
      { fields: ['workspace_id', 'user_id', 'read_at'] },
      { fields: ['workspace_id', 'user_id', 'created_at'] },
      { fields: ['user_id', 'read_at'] },
    ],
  }
);

return Notification
}
