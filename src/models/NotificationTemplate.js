const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
const NotificationTemplate = sequelize.define(
  'NotificationTemplate',
  {
    template_id: {
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
    event_type: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'task_assigned, content_updated, etc',
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Email subject template',
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'HTML body with placeholders {{var}}',
    },
    placeholders: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
      comment: 'Available variables: {{user_name}}, {{content_title}}, etc',
    },
    is_system: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'System templates cannot be deleted',
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
    tableName: 'notification_templates',
    timestamps: false,
    indexes: [
      { fields: ['workspace_id', 'event_type'] },
    ],
  }
);

return NotificationTemplate
}
