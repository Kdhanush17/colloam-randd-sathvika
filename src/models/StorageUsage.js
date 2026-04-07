const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
const StorageUsage = sequelize.define(
  'StorageUsage',
  {
    usage_id: {
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
      unique: true,
      index: true,
    },
    total_bytes: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
      comment: 'Total storage used in bytes',
    },
    limit_bytes: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: 'Storage limit in bytes based on plan',
    },
    file_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    last_calculated_at: {
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
    tableName: 'storage_usage',
    timestamps: false,
    indexes: [
      { fields: ['workspace_id'] },
    ],
  }
);

return StorageUsage
}
