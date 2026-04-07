const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
const File = sequelize.define(
  'File',
  {
    file_id: {
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
      index: true,
    },
    original_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    s3_key: {
      type: DataTypes.STRING(500),
      allowNull: false,
      unique: true,
    },
    file_size: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: 'File size in bytes',
    },
    mime_type: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    uploaded_by: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
         model: 'user_account',
          key: 'userCode',
      },
    },
    uploaded_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'files',
    timestamps: false,
    indexes: [
      { fields: ['workspace_id'] },
      { fields: ['content_id'] },
      { fields: ['uploaded_at'] },
    ],
  }
);

return File
}
