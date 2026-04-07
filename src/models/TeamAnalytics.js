const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
const TeamAnalytics = sequelize.define(
  'TeamAnalytics',
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
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'user_account',
        key: 'userCode',
      },
      index: true,
    },
    tasks_completed: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    tasks_pending: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    content_published: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    content_in_progress: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    hours_worked: {
      type: DataTypes.NUMERIC(8, 2),
      defaultValue: 0,
      comment: 'Estimated hours worked this period',
    },
    last_activity: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    measurement_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
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
    tableName: 'team_analytics',
    timestamps: false,
    indexes: [
      { fields: ['workspace_id', 'user_id'] },
      { fields: ['workspace_id', 'measurement_date'] },
    ],
  }
);

return TeamAnalytics
}
