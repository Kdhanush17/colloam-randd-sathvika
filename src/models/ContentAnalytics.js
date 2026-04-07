const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
const ContentAnalytics = sequelize.define(
  'ContentAnalytics',
  {
    analytics_id: {
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
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    engagement_minutes: {
      type: DataTypes.NUMERIC(8, 2),
      defaultValue: 0,
      comment: 'Total minutes viewers engaged with content',
    },
    stage_transitions: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Number of times content moved between stages',
    },
    avg_stage_duration_hours: {
      type: DataTypes.NUMERIC(8, 2),
      defaultValue: 0,
      comment: 'Average time spent in each stage',
    },
    publish_date: {
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
  },
  {
    tableName: 'content_analytics',
    timestamps: false,
    indexes: [
      { fields: ['workspace_id', 'content_id'] },
      { fields: ['workspace_id', 'created_at'] },
    ],
  }
);

return ContentAnalytics
}
