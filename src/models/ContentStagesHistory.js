const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
const ContentStagesHistory = sequelize.define(
  'ContentStagesHistory',
  {
    history_id: {
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
      allowNull: false,
      references: {
        model: 'content',
        key: 'content_id',
      },
      index: true,
    },
    from_stage_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'workflow_stages',
        key: 'id',
      },
    },
    to_stage_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'workflow_stages',
        key: 'id',
      },
    },
    moved_by: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'user_account',
        key: 'userCode',
      },
    },
    moved_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    duration_seconds: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Seconds spent in previous stage',
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'content_stages_history',
    timestamps: false,
    indexes: [
      { fields: ['content_id'] },
      { fields: ['workspace_id'] },
      { fields: ['moved_at'] },
    ],
  }
);

return ContentStagesHistory
}