const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TeamMember = sequelize.define(
    'TeamMember',
    {
      member_id: {
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
        index: true,
      },
      role_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'roles',
          key: 'role_id',
        },
      },
      invited_by: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'user_account',
          key: 'userCode',
        },
      },
      joined_at: {
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
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'team_members',
      timestamps: false,
      indexes: [
        { fields: ['workspace_id', 'user_id'], unique: true },
        { fields: ['workspace_id'] },
        { fields: ['user_id'] },
        { fields: ['role_id'] },
      ],
    }
  );

  return TeamMember;
};