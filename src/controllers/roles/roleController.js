const db = require('../../models');
const logger = require('../../../utils/winston');
const { Op } = require('sequelize');


// ==============================
// ✅ CREATE ROLE
// ==============================

let createRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role || role.trim() === "") {
      return logger.error(res, "Role is required");
    }

    const upperCaseRole = role.toUpperCase();

    // Case-insensitive check
    const existingRole = await db.roles.findOne({
      where: {
        role: { [Op.iLike]: upperCaseRole }
      }
    });

    if (existingRole) {
      return logger.error(res, "Role already exists");
    }

    const newRole = await db.roles.create({
      role: upperCaseRole,
      status: "ACTIVE"
    });

    return logger.success(res, "Role Created Successfully", newRole);

  } catch (error) {
    logger.createLog(__filename, error.message, req);
    return logger.error(res, "Exception in role create");
  }
};

const createRoleByAdmin = async (req, res) => {
  try {
    const { role } = req.body;
    const user = req.user; // coming from auth middleware

    if (!user) {
      return logger.error(res, "Unauthorized");
    }

    let tenant_id = null;

    // ==============================
    // 🔥 ROLE-BASED LOGIC
    // ==============================
    if (user.role === "SUPER_ADMIN") {
      // ✅ Super admin → no tenant restriction
      tenant_id = null;
    } else {
      // ✅ Admin / Tenant user → must have tenant_id
      tenant_id = user.tenant_id;

      if (!tenant_id) {
        return logger.error(res, "Tenant not found");
      }
    }

    // ==============================
    // ✅ CREATE ROLE
    // ==============================
    const newRole = await db.roles.create({
      role,
      tenant_id, // null for super admin
      status: "ACTIVE"
    });

    return logger.success(res, "Role Created Successfully", newRole);

  } catch (error) {
    logger.createLog(__filename, error.message, req);
    return logger.error(res, "Exception in role create");
  }
};


// ==============================
// ✅ UPDATE ROLE
// ==============================
let updateRole = async (req, res) => {
  try {
    const { role_id, role } = req.body;

    // 🔥 tenant_id from middleware (JWT)
    const tenant_id = req.user?.tenant_id;

    if (!tenant_id) {
      return logger.error(res, "Tenant not found");
    }

    if (!role_id) {
      return logger.error(res, "role_id is required");
    }

    if (!role || role.trim() === "") {
      return logger.error(res, "Role is required");
    }

    const upperCaseRole = role.trim().toUpperCase();

    // ==============================
    // ✅ CHECK ROLE EXISTS (WITH TENANT)
    // ==============================
    const existingRole = await db.roles.findOne({
      where: {
        id: role_id,
        tenant_id
      }
    });

    if (!existingRole) {
      return logger.error(res, "Role not found");
    }

    // ==============================
    // ✅ CHECK DUPLICATE ROLE (SAME TENANT)
    // ==============================
    const duplicateRole = await db.roles.findOne({
      where: {
        role: { [Op.iLike]: upperCaseRole },
        tenant_id,
        id: { [Op.ne]: role_id } // exclude current role
      }
    });

    if (duplicateRole) {
      return logger.error(res, "Role already exists for this tenant");
    }

    // ==============================
    // ✅ UPDATE ROLE
    // ==============================
    await db.roles.update(
      {
        role: upperCaseRole
      },
      {
        where: {
          id: role_id,
          tenant_id
        }
      }
    );

    // ==============================
    // ✅ FETCH UPDATED ROLE
    // ==============================
    const updatedRole = await db.roles.findOne({
      where: {
        id: role_id,
        tenant_id
      }
    });

    return logger.success(res, "Role updated successfully", updatedRole);

  } catch (error) {
    logger.createLog(__filename, error.message, req);
    return logger.error(res, "Exception in updating role");
  }
};


// ==============================
// ✅ GET ROLES
// ==============================
let getRoles = async (req, res) => {
  try {
    const tenant_id = req.user?.tenant_id;

    if (!tenant_id) {
      return logger.error(res, "Tenant not found");
    }

    // ==============================
    // 🔹 QUERY PARAMS
    // ==============================
    let { page = 1, limit = 10, search = "" } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const offset = (page - 1) * limit;

    // ==============================
    // 🔹 WHERE CONDITION
    // ==============================
    let whereCondition = {
      tenant_id
    };

    if (search) {
      whereCondition.role = {
        [Op.iLike]: `%${search}%`
      };
    }

    // ==============================
    // 🔹 FETCH DATA
    // ==============================
    const { count, rows } = await db.roles.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [["createdAt", "DESC"]]
    });

    // ==============================
    // 🔹 RESPONSE
    // ==============================
    return logger.success(res, "Roles fetched successfully", {
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
      roles: rows
    });

  } catch (error) {
    logger.createLog(__filename, error.message, req);
    return logger.error(res, "Exception in fetching roles");
  }
};


// ==============================
// ✅ DELETE ROLE (SOFT)
// ==============================
let deleteRole = async (req, res) => {
  try {
    const { role_id } = req.body;

    // 🔥 tenant from middleware
    const tenant_id = req.user?.tenant_id;

    if (!tenant_id) {
      return logger.error(res, "Tenant not found");
    }

    if (!role_id) {
      return logger.error(res, "role_id is required");
    }

    // ==============================
    // ✅ CHECK ROLE EXISTS
    // ==============================
    const role = await db.roles.findOne({
      where: {
        id: role_id,
        tenant_id
      }
    });

    if (!role) {
      return logger.error(res, "Role not found");
    }

    // ==============================
    // ❗ CHECK IF ROLE ASSIGNED TO USERS
    // ==============================
    const assignedUsers = await db.users.findOne({
      where: {
        role_id,
        tenant_id
      }
    });

    if (assignedUsers) {
      return logger.error(res, "Cannot delete role assigned to users");
    }

    // ==============================
    // ❗ OPTIONAL: CHECK PERMISSIONS LINKED
    // ==============================
    const rolePermissions = await db.role_permissions.findOne({
      where: {
        role_id,
        tenant_id
      }
    });

    if (rolePermissions) {
      return logger.error(res, "Remove permissions before deleting role");
    }

    // ==============================
    // ✅ DELETE ROLE
    // ==============================
    await db.roles.destroy({
      where: {
        id: role_id,
        tenant_id
      }
    });

    return logger.success(res, "Role deleted successfully");

  } catch (error) {
    logger.createLog(__filename, error.message, req);
    return logger.error(res, "Exception in deleting role");
  }
};


// ==============================
// ✅ GET ROLES BY ADMIN
// ==============================
const getRolesByAdmin = async (req, res) => {
  try {
    const userRoleId = req.userDetails?.role_id;

    if (!userRoleId) {
      return logger.error(res, "Invalid token");
    }

    const roleData = await db.roles.findByPk(userRoleId);

    if (!roleData) {
      return logger.error(res, "Role not found");
    }

    const currentUserRole = roleData.role;

    let roleFilter = {
      status: { [Op.in]: ["ACTIVE", true] }
    };

    if (currentUserRole === "ADMIN") {
      roleFilter.role = { [Op.notIn]: ["SUPER_ADMIN"] };
    } else if (currentUserRole === "RECRUITER") {
      roleFilter.role = { [Op.notIn]: ["SUPER_ADMIN", "ADMIN"] };
    }

    const roles = await db.roles.findAll({
      where: roleFilter,
      attributes: ["role", "status", "createdAt", "updatedAt"]
    });

    return logger.success(res, "Roles retrieved", roles);

  } catch (error) {
    logger.createLog(__filename, error.message, req);
    return logger.error(res, "Exception in getRolesByAdmin");
  }
};


// ==============================
// ✅ GET ROLE BY NAME
// ==============================
const getRoleByName = async (req, res) => {
  try {
    const { role } = req.query;

    if (!role || !role.trim()) {
      return logger.error(res, "Role name required", 400);
    }

    const normalizedRole = role.trim();

    const roles = await db.roles.findAll({
      where: {
        role: { [Op.iLike]: normalizedRole }
      }
    });

    if (!roles.length) {
      return logger.error(res, `No roles found for ${role}`);
    }

    return res.status(200).json({
      status: true,
      message: "Roles fetched",
      totalCount: roles.length,
      data: roles
    });

  } catch (error) {
    logger.createLog(__filename, error.message, req);
    return logger.error(res, "Exception in getRoleByName");
  }
};


module.exports = {
  createRole,
  updateRole,
  getRoles,
  deleteRole,
  getRolesByAdmin,
  getRoleByName
};