const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
const TeamInvitation = sequelize.define(
  'TeamInvitation',
  {
    invitation_id: {
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
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: { isEmail: true },
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
      allowNull: false,
      references: {
       model: 'user_account',
        key: 'userCode',
      },
    },
    invited_user_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'user_account',
        key: 'userCode',
      },
      comment: 'Optional: if user exists in system when invited',
    },
    token: {
      type: DataTypes.STRING(500),
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'expired', 'declined'),
      defaultValue: 'pending',
      index: true,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: 'Invitation expires after 7 days',
    },
    accepted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    declined_at: {
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
    tableName: 'team_invitations',
    timestamps: false,
    indexes: [
      { fields: ['workspace_id', 'status'] },
      { fields: ['email', 'workspace_id'] },
      { fields: ['expires_at'] },
    ],
  }
);

return TeamInvitation
}
