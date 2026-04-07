const express = require('express');
const router = express.Router();
const { unifiedAuthMiddleware } = require('../middleware/auth');
const teamController = require('../src/controllers/teamManagement/teamManagementController');
const logger = require('../utils/winston');

// =============================
// 📌 MIDDLEWARE TO GET TENANT DB
// =============================
const getTenantDB = (req, res, next) => {
  if (!req.tenantDB) {
    return res.status(400).json({
      status: false,
      message: 'Tenant database connection not found',
    });
  }
  next();
};

// =============================
// 📌 INVITE TEAM MEMBER
// =============================
/**
 * POST /api/team-management/invite
 * Body: { email, roleId }
 */
router.post(
  '/invite',
  unifiedAuthMiddleware,
  getTenantDB,
  async (req, res) => {
    try {
      const { email, roleId } = req.body;
      const { userCode, workspace_id } = req.user;

      // Validation
      if (!email || !roleId) {
        return res.status(400).json({
          status: false,
          message: 'Email and roleId are required',
        });
      }

      if (!workspace_id) {
        return res.status(400).json({
          status: false,
          message: 'Workspace ID not found in token',
        });
      }

      const result = await teamController.inviteTeamMember(
        workspace_id,
        email,
        roleId,
        userCode,
        req.tenantDB
      );

      return res.status(200).json({
        status: true,
        message: 'Invitation sent successfully',
        data: result,
      });
    } catch (error) {
      logger.error('Error in invite team member route:', error);
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        status: false,
        message: error.message || 'Error inviting team member',
      });
    }
  }
);

// =============================
// 📌 ACCEPT INVITATION
// =============================
/**
 * POST /api/team-management/accept-invitation
 * Body: { token }
 */
router.post(
  '/accept-invitation',
  unifiedAuthMiddleware,
  getTenantDB,
  async (req, res) => {
    try {
      const { token } = req.body;
      const { userCode } = req.user;

      if (!token) {
        return res.status(400).json({
          status: false,
          message: 'Invitation token is required',
        });
      }

      const result = await teamController.acceptInvitation(
        token,
        userCode,
        req.tenantDB
      );

      return res.status(200).json({
        status: true,
        message: 'Invitation accepted successfully',
        data: result,
      });
    } catch (error) {
      logger.error('Error in accept invitation route:', error);
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        status: false,
        message: error.message || 'Error accepting invitation',
      });
    }
  }
);

// =============================
// 📌 ADD TEAM MEMBER (Direct)
// =============================
/**
 * POST /api/team-management/add-member
 * Body: { userId, roleId }
 */
router.post(
  '/add-member',
  unifiedAuthMiddleware,
  getTenantDB,
  async (req, res) => {
    try {
      const { userId, roleId } = req.body;
      const { userCode, workspace_id } = req.user;

      if (!userId || !roleId) {
        return res.status(400).json({
          status: false,
          message: 'userId and roleId are required',
        });
      }

      if (!workspace_id) {
        return res.status(400).json({
          status: false,
          message: 'Workspace ID not found in token',
        });
      }

      const result = await teamController.addTeamMember(
        workspace_id,
        userId,
        roleId,
        userCode,
        req.tenantDB
      );

      return res.status(200).json({
        status: true,
        message: 'Team member added successfully',
        data: result,
      });
    } catch (error) {
      logger.error('Error in add team member route:', error);
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        status: false,
        message: error.message || 'Error adding team member',
      });
    }
  }
);

// =============================
// 📌 UPDATE TEAM MEMBER ROLE
// =============================
/**
 * PUT /api/team-management/update-role
 * Body: { userId, newRoleId }
 */
router.put(
  '/update-role',
  unifiedAuthMiddleware,
  getTenantDB,
  async (req, res) => {
    try {
      const { userId, newRoleId } = req.body;
      const { workspace_id } = req.user;

      if (!userId || !newRoleId) {
        return res.status(400).json({
          status: false,
          message: 'userId and newRoleId are required',
        });
      }

      if (!workspace_id) {
        return res.status(400).json({
          status: false,
          message: 'Workspace ID not found in token',
        });
      }

      const result = await teamController.updateTeamMemberRole(
        workspace_id,
        userId,
        newRoleId,
        req.tenantDB
      );

      return res.status(200).json({
        status: true,
        message: 'Team member role updated successfully',
        data: result,
      });
    } catch (error) {
      logger.error('Error in update role route:', error);
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        status: false,
        message: error.message || 'Error updating team member role',
      });
    }
  }
);

// =============================
// 📌 REMOVE TEAM MEMBER
// =============================
/**
 * DELETE /api/team-management/remove-member/:userId
 */
router.delete(
  '/remove-member/:userId',
  unifiedAuthMiddleware,
  getTenantDB,
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { workspace_id } = req.user;

      if (!userId) {
        return res.status(400).json({
          status: false,
          message: 'userId is required',
        });
      }

      if (!workspace_id) {
        return res.status(400).json({
          status: false,
          message: 'Workspace ID not found in token',
        });
      }

      const result = await teamController.removeTeamMember(
        workspace_id,
        userId,
        req.tenantDB
      );

      return res.status(200).json({
        status: true,
        message: 'Team member removed successfully',
        data: result,
      });
    } catch (error) {
      logger.error('Error in remove member route:', error);
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        status: false,
        message: error.message || 'Error removing team member',
      });
    }
  }
);

// =============================
// 📌 LIST TEAM MEMBERS
// =============================
/**
 * GET /api/team-management/members?page=1&limit=20
 */
router.get(
  '/members',
  unifiedAuthMiddleware,
  getTenantDB,
  async (req, res) => {
    try {
      const { page = 1, limit = 20 } = req.query;
      const { workspace_id } = req.user;

      if (!workspace_id) {
        return res.status(400).json({
          status: false,
          message: 'Workspace ID not found in token',
        });
      }

      const result = await teamController.listTeamMembers(
        workspace_id,
        parseInt(page),
        parseInt(limit),
        req.tenantDB
      );

      return res.status(200).json({
        status: true,
        message: 'Team members retrieved successfully',
        data: result,
      });
    } catch (error) {
      logger.error('Error in list team members route:', error);
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        status: false,
        message: error.message || 'Error listing team members',
      });
    }
  }
);

// =============================
// 📌 LIST PENDING INVITATIONS
// =============================
/**
 * GET /api/team-management/pending-invitations?page=1&limit=20
 */
router.get(
  '/pending-invitations',
  unifiedAuthMiddleware,
  getTenantDB,
  async (req, res) => {
    try {
      const { page = 1, limit = 20 } = req.query;
      const { workspace_id } = req.user;

      if (!workspace_id) {
        return res.status(400).json({
          status: false,
          message: 'Workspace ID not found in token',
        });
      }

      const result = await teamController.listPendingInvitations(
        workspace_id,
        parseInt(page),
        parseInt(limit),
        req.tenantDB
      );

      return res.status(200).json({
        status: true,
        message: 'Pending invitations retrieved successfully',
        data: result,
      });
    } catch (error) {
      logger.error('Error in list pending invitations route:', error);
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        status: false,
        message: error.message || 'Error listing pending invitations',
      });
    }
  }
);

// =============================
// 📌 RESEND INVITATION
// =============================
/**
 * POST /api/team-management/resend-invitation
 * Body: { invitationId }
 */
router.post(
  '/resend-invitation',
  unifiedAuthMiddleware,
  getTenantDB,
  async (req, res) => {
    try {
      const { invitationId } = req.body;

      if (!invitationId) {
        return res.status(400).json({
          status: false,
          message: 'invitationId is required',
        });
      }

      const result = await teamController.resendInvitation(
        invitationId,
        req.tenantDB
      );

      return res.status(200).json({
        status: true,
        message: 'Invitation resent successfully',
        data: result,
      });
    } catch (error) {
      logger.error('Error in resend invitation route:', error);
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        status: false,
        message: error.message || 'Error resending invitation',
      });
    }
  }
);

// =============================
// 📌 CANCEL INVITATION
// =============================
/**
 * POST /api/team-management/cancel-invitation
 * Body: { invitationId }
 */
router.post(
  '/cancel-invitation',
  unifiedAuthMiddleware,
  getTenantDB,
  async (req, res) => {
    try {
      const { invitationId } = req.body;

      if (!invitationId) {
        return res.status(400).json({
          status: false,
          message: 'invitationId is required',
        });
      }

      const result = await teamController.cancelInvitation(
        invitationId,
        req.tenantDB
      );

      return res.status(200).json({
        status: true,
        message: 'Invitation cancelled successfully',
        data: result,
      });
    } catch (error) {
      logger.error('Error in cancel invitation route:', error);
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        status: false,
        message: error.message || 'Error cancelling invitation',
      });
    }
  }
);

// =============================
// 📌 BULK ADD TEAM MEMBERS
// =============================
/**
 * POST /api/team-management/bulk-add
 * Body: {
 *   users: [
 *     { email: "user1@example.com", role_id: "role-uuid", invite: false },
 *     { email: "user2@example.com", role_id: "role-uuid", invite: true }
 *   ]
 * }
 */
router.post(
  '/bulk-add',
  unifiedAuthMiddleware,
  getTenantDB,
  async (req, res) => {
    try {
      const { users } = req.body;
      const { userCode, workspace_id } = req.user;

      if (!users || !Array.isArray(users) || users.length === 0) {
        return res.status(400).json({
          status: false,
          message: 'users array is required and must not be empty',
        });
      }

      if (!workspace_id) {
        return res.status(400).json({
          status: false,
          message: 'Workspace ID not found in token',
        });
      }

      const result = await teamController.addBulkTeamMembers(
        workspace_id,
        users,
        userCode,
        req.tenantDB
      );

      return res.status(200).json({
        status: true,
        message: 'Bulk add completed',
        data: result,
      });
    } catch (error) {
      logger.error('Error in bulk add team members route:', error);
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        status: false,
        message: error.message || 'Error adding bulk team members',
      });
    }
  }
);

module.exports = router;
