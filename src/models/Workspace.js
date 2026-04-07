const { DataTypes } = require('sequelize');
const {
  WORKSPACE_STATUS,
  WORKSPACE_TYPES,
  TEAM_SIZE,
  PUBLISHING_FREQUENCY,
} = require('../../utils/constants');

module.exports = (sequelize) => {
const Workspace = sequelize.define(
  'Workspace',
  {
    workspace_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    owner_id: {
      type: DataTypes.UUID,
      allowNull: false,
      // references: {
      //   model: 'user_account',
      //   key: 'userCode',
      // },
      // index: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false,
      index: true,
    },
    workspace_type: {
      type: DataTypes.ENUM(...Object.values(WORKSPACE_TYPES)),
      allowNull: false,
    },
    team_size: {
      type: DataTypes.ENUM(...Object.values(TEAM_SIZE)),
      allowNull: true,
    },
    publishing_frequency: {
      type: DataTypes.ENUM(...Object.values(PUBLISHING_FREQUENCY)),
      allowNull: true,
    },
    timezone: {
      type: DataTypes.STRING(50),
      defaultValue: 'UTC',
    },
    logo_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(WORKSPACE_STATUS)),
      defaultValue: WORKSPACE_STATUS.ACTIVE,
      index: true,
    },
    trial_started_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    trial_expires_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    onboarding_completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
    tableName: 'workspaces',
    timestamps: false,
    indexes: [
      { fields: ['owner_id'] },
      { fields: ['slug'] },
      { fields: ['status'] },
      { fields: ['created_at'] },
    ],
  }
);
return Workspace
}
