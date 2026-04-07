const { DataTypes } = require('sequelize');

const { TASK_STATUS, PRIORITY_LEVELS } = require('../../utils/constants');

module.exports = (sequelize) => {
const Task = sequelize.define(
  'Task',
  {
    task_id: {
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
    content_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'content',
        key: 'content_id',
      },
      comment: 'Optional: linked to content item',
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'user_account',
        key: 'userCode',
      },
    },
    assigned_to: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'user_account',
        key: 'userCode',
      },
    },
    title: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(TASK_STATUS)),
      defaultValue: TASK_STATUS.PENDING,
      index: true,
    },
    priority: {
      type: DataTypes.ENUM(...Object.values(PRIORITY_LEVELS)),
      defaultValue: PRIORITY_LEVELS.MEDIUM,
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    estimated_hours: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    actual_hours: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'tasks',
    timestamps: false,
    indexes: [
      { fields: ['workspace_id', 'assigned_to', 'status'] },
      { fields: ['workspace_id', 'status'] },
      { fields: ['workspace_id', 'created_by'] },
      { fields: ['content_id'] },
      { fields: ['due_date'] },
    ],
  }
);

return Task
}
