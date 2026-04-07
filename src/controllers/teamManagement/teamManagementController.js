const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../../models/index");
const logger = require("../../../utils/winston");
const env = require("../../../config/environment");
const { captureDeviceDetails, generateDeviceToken } = require("../../../utils/deviceDetection");
const path = require("path");
const fs = require("fs");
const AWS = require("aws-sdk");
const multer = require("multer");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
var { gets3details, getsmtpdetails } = require("../../controllers/lib/systemSettings");
const { getDatabaseConnection, initTenantDB, getTenantDB } = require("../../../utils/socketUtilities");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(env.google.GOOGLE_CLIENT_ID);
const { v4: uuidv4 } = require("uuid");
const { Op, Sequelize } = require("sequelize");
const { generateSlug, generateUniqueSlug, validateSlug } = require("../../../utils/slug");
const { Workspace, TeamMember, Role, WorkflowStage, TeamInvitation, User } = require("../../models"); // Updated import
const { SYSTEM_ROLES, DEFAULT_WORKFLOW_STAGES, USER_STATUS } = require("../../../utils/constants");
const { generateTokens, verifyRefreshToken } = require("../../../utils/jwt");
const { getTenantConnection } = require("../../../utils/tenantConnectionManager");

// =============================
// 📌 TEAM MEMBER MANAGEMENT FUNCTIONS
// =============================

/**
 * Invite a new team member via email
 * Stores invitation in TENANT DB and updates MAIN DB mapping
 */
const inviteTeamMember = async (workspaceId, email, roleId, invitedBy, tenantSequelize) => {
  try {
    // Get tenant DB models
    const tenantModels = require('../../models')(tenantSequelize);
    const TenantTeamInvitation = tenantModels.TeamInvitation;
    const TenantRole = tenantModels.Role;

    // Validate role exists and belongs to workspace in TENANT DB
    const role = await TenantRole.findByPk(roleId);
    if (!role || role.workspace_id !== workspaceId) {
      throw { statusCode: 404, message: 'Role not found' };
    }

    // Check for existing invitation (pending) in TENANT DB
    const existingInvitation = await TenantTeamInvitation.findOne({
      where: {
        workspace_id: workspaceId,
        email,
        status: 'pending',
      },
    });

    if (existingInvitation) {
      throw { statusCode: 409, message: 'Invitation already pending for this email' };
    }

    // Check if user exists in MAIN DB
    const existingUser = await db.user_account.findOne({ where: { email } });

    // Check if already member in TENANT DB
    const TenantTeamMember = tenantModels.TeamMember;
    const existingMember = existingUser
      ? await TenantTeamMember.findOne({
          where: {
            workspace_id: workspaceId,
            user_id: existingUser.userCode,
          },
        })
      : null;

    if (existingMember) {
      throw { statusCode: 409, message: 'User is already a team member' };
    }

    // Generate invitation token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Create invitation in TENANT DB
    const invitation = await TenantTeamInvitation.create({
      workspace_id: workspaceId,
      email,
      role_id: roleId,
      invited_by: invitedBy,
      invited_user_id: existingUser?.userCode || null,
      token,
      expires_at: expiresAt,
    });

    logger.info(`Team invitation created for ${email} in workspace ${workspaceId}`);

    return {
      invitation_id: invitation.invitation_id,
      email: invitation.email,
      status: invitation.status,
      expires_at: invitation.expires_at,
    };
  } catch (error) {
    logger.error('Error inviting team member:', error);
    throw error;
  }
};

/**
 * Accept team invitation
 * Updates TENANT DB team member and MAIN DB mapping users array
 */
const acceptInvitation = async (token, userId, tenantSequelize) => {
  try {
    // Get tenant DB models
    const tenantModels = require('../../models')(tenantSequelize);
    const TenantTeamInvitation = tenantModels.TeamInvitation;
    const TenantTeamMember = tenantModels.TeamMember;
    const TenantRole = tenantModels.Role;

    const invitation = await TenantTeamInvitation.findOne({
      where: { token },
      include: [
        { model: TenantRole, as: 'role' },
      ],
    });

    if (!invitation) {
      throw { statusCode: 404, message: 'Invitation not found' };
    }

    if (invitation.status !== 'pending') {
      throw { statusCode: 400, message: `Invitation has already been ${invitation.status}` };
    }

    if (new Date() > invitation.expires_at) {
      throw { statusCode: 400, message: 'Invitation has expired' };
    }

    // Check if user already a member in TENANT DB
    const existingMember = await TenantTeamMember.findOne({
      where: {
        workspace_id: invitation.workspace_id,
        user_id: userId,
      },
    });

    if (existingMember) {
      throw { statusCode: 409, message: 'User is already a team member' };
    }

    // Get user details from MAIN DB
    const user = await db.user_account.findByPk(userId);
    if (!user) {
      throw { statusCode: 404, message: 'User not found' };
    }

    // Add user as team member in TENANT DB
    const teamMember = await TenantTeamMember.create({
      workspace_id: invitation.workspace_id,
      user_id: userId,
      role_id: invitation.role_id,
      invited_by: invitation.invited_by,
      status: 'active',
    });

    // Update invitation status in TENANT DB
    await invitation.update({
      status: 'accepted',
      accepted_at: new Date(),
      invited_user_id: userId,
    });

    // Update MAIN DB mapping users array
    const mapping = await db.database_mappings.findOne({
      where: { workspace_id: invitation.workspace_id },
    });

    if (mapping) {
      const users = mapping.users || [];
      // Add or update user in users array
      const userIndex = users.findIndex(u => u.userCode === userId);
      const userData = {
        userCode: userId,
        email: user.email,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
        role_id: invitation.role_id,
        role_name: invitation.role.name,
        status: 'active',
      };

      if (userIndex >= 0) {
        users[userIndex] = userData;
      } else {
        users.push(userData);
      }

      await mapping.update({ users });
    }

    logger.info(`Team invitation accepted by user ${userId} for workspace ${invitation.workspace_id}`);

    return {
      workspace_id: invitation.workspace_id,
      role: invitation.role.name,
      joined_at: new Date().toISOString(),
    };
  } catch (error) {
    logger.error('Error accepting invitation:', error);
    throw error;
  }
};

/**
 * Add existing user to team
 * Creates team member in TENANT DB and updates MAIN DB mapping
 */
const addTeamMember = async (workspaceId, userId, roleId, addedBy, tenantSequelize) => {
  try {
    // Get tenant DB models
    const tenantModels = require('../../models')(tenantSequelize);
    const TenantTeamMember = tenantModels.TeamMember;
    const TenantRole = tenantModels.Role;

    // Validate role in TENANT DB
    const role = await TenantRole.findByPk(roleId);
    if (!role || role.workspace_id !== workspaceId) {
      throw { statusCode: 404, message: 'Role not found' };
    }

    // Check if user exists in MAIN DB
    const user = await db.user_account.findByPk(userId);
    if (!user) {
      throw { statusCode: 404, message: 'User not found' };
    }

    // Check if already member in TENANT DB
    const existingMember = await TenantTeamMember.findOne({
      where: {
        workspace_id: workspaceId,
        user_id: userId,
      },
    });

    if (existingMember) {
      throw { statusCode: 409, message: 'User is already a team member' };
    }

    // Create member in TENANT DB
    const member = await TenantTeamMember.create({
      workspace_id: workspaceId,
      user_id: userId,
      role_id: roleId,
      invited_by: addedBy,
      status: 'active',
    });

    // Update MAIN DB mapping users array
    const mapping = await db.database_mappings.findOne({
      where: { workspace_id: workspaceId },
    });

    if (mapping) {
      const users = mapping.users || [];
      const userData = {
        userCode: userId,
        email: user.email,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
        role_id: roleId,
        role_name: role.name,
        status: 'active',
      };

      // Add or update user in users array
      const userIndex = users.findIndex(u => u.userCode === userId);
      if (userIndex >= 0) {
        users[userIndex] = userData;
      } else {
        users.push(userData);
      }

      await mapping.update({ users });
    }

    logger.info(`User ${userId} added to workspace ${workspaceId}`);

    return {
      team_member_id: member.member_id,
      user_id: member.user_id,
      role_id: member.role_id,
      status: member.status,
    };
  } catch (error) {
    logger.error('Error adding team member:', error);
    throw error;
  }
};

/**
 * Update team member role
 */
const updateTeamMemberRole = async (workspaceId, userId, newRoleId, tenantSequelize) => {
  try {
    // Get tenant DB models
    const tenantModels = require('../../models')(tenantSequelize);
    const TenantTeamMember = tenantModels.TeamMember;
    const TenantRole = tenantModels.Role;

    const member = await TenantTeamMember.findOne({
      where: {
        workspace_id: workspaceId,
        user_id: userId,
      },
    });

    if (!member) {
      throw { statusCode: 404, message: 'Team member not found' };
    }

    const role = await TenantRole.findByPk(newRoleId);
    if (!role || role.workspace_id !== workspaceId) {
      throw { statusCode: 404, message: 'Role not found' };
    }

    await member.update({ role_id: newRoleId });

    // Update MAIN DB mapping users array
    const mapping = await db.database_mappings.findOne({
      where: { workspace_id: workspaceId },
    });

    if (mapping) {
      const users = mapping.users || [];
      const userIndex = users.findIndex(u => u.userCode === userId);
      if (userIndex >= 0) {
        users[userIndex].role_id = newRoleId;
        users[userIndex].role_name = role.name;
        await mapping.update({ users });
      }
    }

    logger.info(`Team member ${userId} role updated in workspace ${workspaceId}`);

    return {
      team_member_id: member.member_id,
      role_id: member.role_id,
      updated_at: member.updated_at,
    };
  } catch (error) {
    logger.error('Error updating team member role:', error);
    throw error;
  }
};

/**
 * Remove team member from workspace
 * Removes from TENANT DB and MAIN DB mapping
 */
const removeTeamMember = async (workspaceId, userId, tenantSequelize) => {
  try {
    // Get tenant DB models
    const tenantModels = require('../../models')(tenantSequelize);
    const TenantTeamMember = tenantModels.TeamMember;

    const member = await TenantTeamMember.findOne({
      where: {
        workspace_id: workspaceId,
        user_id: userId,
      },
    });

    if (!member) {
      throw { statusCode: 404, message: 'Team member not found' };
    }

    await member.destroy();

    // Remove from MAIN DB mapping users array
    const mapping = await db.database_mappings.findOne({
      where: { workspace_id: workspaceId },
    });

    if (mapping) {
      let users = mapping.users || [];
      users = users.filter(u => u.userCode !== userId);
      await mapping.update({ users });
    }

    logger.info(`User ${userId} removed from workspace ${workspaceId}`);

    return { success: true };
  } catch (error) {
    logger.error('Error removing team member:', error);
    throw error;
  }
};

/**
 * List team members with pagination (from TENANT DB)
 */
const listTeamMembers = async (workspaceId, page = 1, limit = 20, tenantSequelize) => {
  try {
    // Get tenant DB models
    const tenantModels = require('../../models')(tenantSequelize);
    const TenantTeamMember = tenantModels.TeamMember;
    const TenantUser = tenantModels.User;
    const TenantRole = tenantModels.Role;

    const offset = (page - 1) * limit;

    const { count, rows } = await TenantTeamMember.findAndCountAll({
      where: { workspace_id: workspaceId },
      include: [
        {
          model: TenantUser,
          as: 'user',
          attributes: ['userCode', 'email', 'full_name', 'avatar_url']
        },
        {
          model: TenantRole,
          as: 'role',
          attributes: ['role_id', 'name']
        },
      ],
      limit,
      offset,
      order: [['created_at', 'DESC']],
    });

    // Format response with required fields: userCode, email, role_id, role_name, status
    const members = rows.map(member => ({
      team_member_id: member.member_id,
      userCode: member.user.userCode,
      email: member.user.email,
      full_name: member.user.full_name,
      avatar_url: member.user.avatar_url,
      role_id: member.role.role_id,
      role_name: member.role.name,
      status: member.status,
      joined_at: member.joined_at,
      created_at: member.created_at,
    }));

    return {
      workspace_id: workspaceId,
      members,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit),
        hasMore: page < Math.ceil(count / limit),
      },
    };
  } catch (error) {
    logger.error('Error listing team members:', error);
    throw error;
  }
};

/**
 * List pending invitations (from TENANT DB)
 */
const listPendingInvitations = async (workspaceId, page = 1, limit = 20, tenantSequelize) => {
  try {
    // Get tenant DB models
    const tenantModels = require('../../models')(tenantSequelize);
    const TenantTeamInvitation = tenantModels.TeamInvitation;
    const TenantRole = tenantModels.Role;
    const TenantUser = tenantModels.User;

    const offset = (page - 1) * limit;

    const { count, rows } = await TenantTeamInvitation.findAndCountAll({
      where: {
        workspace_id: workspaceId,
        status: 'pending',
      },
      include: [
        {
          model: TenantRole,
          as: 'role',
          attributes: ['role_id', 'name']
        },
        {
          model: TenantUser,
          as: 'invitedByUser',
          attributes: ['userCode', 'full_name', 'email']
        },
      ],
      limit,
      offset,
      order: [['created_at', 'DESC']],
    });

    // Format response with required fields
    const invitations = rows.map(invitation => ({
      invitation_id: invitation.invitation_id,
      workspace_id: invitation.workspace_id,
      email: invitation.email,
      role_id: invitation.role.role_id,
      role_name: invitation.role.name,
      invited_by: invitation.invitedByUser?.full_name || 'Unknown',
      status: invitation.status,
      expires_at: invitation.expires_at,
      created_at: invitation.created_at,
    }));

    return {
      workspace_id: workspaceId,
      invitations,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit),
        hasMore: page < Math.ceil(count / limit),
      },
    };
  } catch (error) {
    logger.error('Error listing pending invitations:', error);
    throw error;
  }
};

/**
 * Resend invitation
 */
const resendInvitation = async (invitationId, tenantSequelize) => {
  try {
    // Get tenant DB models
    const tenantModels = require('../../models')(tenantSequelize);
    const TenantTeamInvitation = tenantModels.TeamInvitation;

    const invitation = await TenantTeamInvitation.findByPk(invitationId);

    if (!invitation) {
      throw { statusCode: 404, message: 'Invitation not found' };
    }

    if (invitation.status !== 'pending') {
      throw { statusCode: 400, message: 'Can only resend pending invitations' };
    }

    if (new Date() > invitation.expires_at) {
      const newToken = crypto.randomBytes(32).toString('hex');
      const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      await invitation.update({
        token: newToken,
        expires_at: newExpiresAt,
      });
    }

    logger.info(`Invitation ${invitationId} resent`);

    return { success: true };
  } catch (error) {
    logger.error('Error resending invitation:', error);
    throw error;
  }
};

/**
 * Cancel invitation
 */
const cancelInvitation = async (invitationId, tenantSequelize) => {
  try {
    // Get tenant DB models
    const tenantModels = require('../../models')(tenantSequelize);
    const TenantTeamInvitation = tenantModels.TeamInvitation;

    const invitation = await TenantTeamInvitation.findByPk(invitationId);

    if (!invitation) {
      throw { statusCode: 404, message: 'Invitation not found' };
    }

    if (invitation.status !== 'pending') {
      throw { statusCode: 400, message: 'Can only cancel pending invitations' };
    }

    await invitation.update({ status: 'declined', declined_at: new Date() });

    logger.info(`Invitation ${invitationId} cancelled`);

    return { success: true };
  } catch (error) {
    logger.error('Error cancelling invitation:', error);
    throw error;
  }
};

/**
 * Add multiple team members at once (for bulk team creation)
 * Adds to TENANT DB and syncs MAIN DB mapping
 * Expected users format: [{ email, role_id, userCode?, invite: true/false }, ...]
 */
const addBulkTeamMembers = async (workspaceId, users, addedBy, tenantSequelize) => {
  try {
    // Get tenant DB models
    const tenantModels = require('../../models')(tenantSequelize);
    const TenantTeamMember = tenantModels.TeamMember;
    const TenantTeamInvitation = tenantModels.TeamInvitation;
    const TenantRole = tenantModels.Role;

    const results = {
      added: [],
      invited: [],
      failed: [],
    };

    // Get mapping for users array
    const mapping = await db.database_mappings.findOne({
      where: { workspace_id: workspaceId },
    });

    let mappingUsers = mapping?.users || [];

    for (const user of users) {
      try {
        const { email, role_id, userCode, invite } = user;

        if (!email || !role_id) {
          results.failed.push({
            email,
            reason: 'Missing email or role_id',
          });
          continue;
        }

        // Get role info
        const role = await TenantRole.findByPk(role_id);
        if (!role) {
          results.failed.push({
            email,
            reason: 'Role not found',
          });
          continue;
        }

        // Check if user exists in MAIN DB
        const existingUser = await db.user_account.findOne({ where: { email } });

        if (invite || !existingUser) {
          // Send invitation
          const inviteResult = await inviteTeamMember(workspaceId, email, role_id, addedBy, tenantSequelize);
          results.invited.push({
            ...inviteResult,
            email,
            role_id,
            role_name: role.name,
            status: 'pending',
          });
        } else {
          // Add directly to TENANT DB
          const existingMember = await TenantTeamMember.findOne({
            where: {
              workspace_id: workspaceId,
              user_id: existingUser.userCode,
            },
          });

          if (existingMember) {
            results.failed.push({
              email,
              reason: 'User already a team member',
            });
            continue;
          }

          const member = await TenantTeamMember.create({
            workspace_id: workspaceId,
            user_id: existingUser.userCode,
            role_id: role_id,
            invited_by: addedBy,
            status: 'active',
          });

          // Add to mapping users array
          const userData = {
            userCode: existingUser.userCode,
            email: existingUser.email,
            full_name: existingUser.full_name,
            avatar_url: existingUser.avatar_url,
            role_id: role_id,
            role_name: role.name,
            status: 'active',
          };

          const userIndex = mappingUsers.findIndex(u => u.userCode === existingUser.userCode);
          if (userIndex >= 0) {
            mappingUsers[userIndex] = userData;
          } else {
            mappingUsers.push(userData);
          }

          results.added.push({
            team_member_id: member.member_id,
            user_id: member.user_id,
            email,
            role_id: member.role_id,
            role_name: role.name,
            status: 'active',
          });
        }
      } catch (error) {
        results.failed.push({
          email: user.email,
          reason: error.message || 'Unknown error',
        });
      }
    }

    // Update MAIN DB mapping with all users
    if (mapping) {
      await mapping.update({ users: mappingUsers });
    }

    logger.info(`Bulk team members added to workspace ${workspaceId}:`, results);

    return {
      workspace_id: workspaceId,
      ...results,
      summary: {
        added: results.added.length,
        invited: results.invited.length,
        failed: results.failed.length,
        total: users.length,
      },
    };
  } catch (error) {
    logger.error('Error adding bulk team members:', error);
    throw error;
  }
};

// Export all functions
module.exports = {
  inviteTeamMember,
  acceptInvitation,
  addTeamMember,
  updateTeamMemberRole,
  removeTeamMember,
  listTeamMembers,
  listPendingInvitations,
  resendInvitation,
  cancelInvitation,
  addBulkTeamMembers,
};
