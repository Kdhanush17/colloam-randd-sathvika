const { DataTypes } = require('sequelize');
const { CONTENT_TYPES, PRIORITY_LEVELS } = require('../../utils/constants');

module.exports = (sequelize) => {
const Content = sequelize.define(
  'Content',
  {
    content_id: {
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
    brand_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    current_stage_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'workflow_stages',
        key: 'id',
      },
      index: true,
    },
    title: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    content_type: {
      type: DataTypes.ENUM(...Object.values(CONTENT_TYPES)),
      allowNull: true,
    },
    priority: {
      type: DataTypes.ENUM(...Object.values(PRIORITY_LEVELS)),
      defaultValue: PRIORITY_LEVELS.MEDIUM,
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: 'draft',
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    moved_to_stage_at: {
      type: DataTypes.DATE,
      allowNull: true,
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
    tableName: 'content',
    timestamps: false,
    indexes: [
      { fields: ['workspace_id', 'current_stage_id'] },
      { fields: ['workspace_id', 'created_by'] },
      { fields: ['workspace_id', 'assigned_to'] },
      { fields: ['workspace_id', 'priority'] },
      { fields: ['created_at'] },
    ],
  }
);

return Content
}
