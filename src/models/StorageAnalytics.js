const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
const StorageAnalytics = sequelize.define(
  'StorageAnalytics',
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
    measurement_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    total_bytes: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
    file_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    video_bytes: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
    image_bytes: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
    document_bytes: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
    other_bytes: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
    trend_percentage: {
      type: DataTypes.NUMERIC(5, 2),
      comment: 'Percentage change from previous period',
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'storage_analytics',
    timestamps: false,
    indexes: [
      { fields: ['workspace_id', 'measurement_date'] },
    ],
  }
);

return StorageAnalytics
}
