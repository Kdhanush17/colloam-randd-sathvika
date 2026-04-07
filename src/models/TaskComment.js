const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
const TaskComment = sequelize.define(
  'TaskComment',
  {
    comment_id: {
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
    task_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'tasks',
        key: 'task_id',
      },
      index: true,
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
       model: 'user_account',
        key: 'userCode',
      },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    mentions: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      defaultValue: [],
      comment: 'Array of user IDs mentioned in comment',
    },
    edited_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'task_comments',
    timestamps: false,
    indexes: [
      { fields: ['task_id', 'created_at'] },
      { fields: ['workspace_id'] },
    ],
  }
);

return TaskComment;
}