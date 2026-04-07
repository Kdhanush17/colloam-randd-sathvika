const db = require('../../models');
const logger = require('../../../utils/winston');
const { Op } = require('sequelize');
const { getTenantDB } = require("../../../utils/socketUtilities");


// ==============================
// ✅ CREATE ACL
// ==============================
const createAcl = async (req, res) => {
  try {
    const { permission_id, role_id, userCode } = req.body;

    // =============================
    // ✅ VALIDATION
    // =============================
    if (!permission_id || !role_id) {
      return logger.error(res, "permission_id and role_id are required");
    }

    // =============================
    // 🔥 FINAL USER CODE
    // =============================
    const userCodes = userCode || req.user?.userCode;
    if (!userCodes) {
      return logger.error(res, "userCode is required");
    }

    // =============================
    // ✅ CHECK PERMISSION (MAIN DB)
    // =============================
    const permission = await db.permissions.findOne({
      where: { id: permission_id }
    });

    if (!permission) {
      return logger.error(res, "Invalid permission_id");
    }

    // =============================
    // 🔥 GET TENANT DB
    // =============================
    const { sequelize, type, mapping } = await getTenantDB(userCodes);

    // =============================
    // 🔥 LOAD MODEL
    // =============================
    let SystemUserPermission;

    if (type === "TENANT") {
      console.log("👉 Using TENANT DB");
      SystemUserPermission = require("../../models/systemUserPermissions")(sequelize);
    } else {
      console.log("👉 Using MAIN DB");
      SystemUserPermission = db.system_user_permissions;
    }

    // =============================
    // 🚫 DUPLICATE CHECK
    // =============================
    const exists = await SystemUserPermission.findOne({
      where: { permission_id, role_id }
    });
    if (exists) {
      return logger.error(res, "Permission already assigned to role");
    }

    // =============================
    // ✅ CREATE ACL
    // =============================
    const acl = await SystemUserPermission.create({
      permission_id,
      role_id
    });

    return logger.success(
      res,
      `Permission assigned in ${type} DB`,
      acl
    );

  } catch (error) {
    logger.createLog(__filename, error.message, req);
    return logger.error(res, "Exception in permission create");
  }
};



// ==============================
// ✅ DELETE ACL
// ==============================
const dropAcl = async (req, res) => {
  try {
    const { permission_id, role_id, userCode } = req.body;

    if (!permission_id || !role_id) {
      return logger.error(res, "Missing permission_id or role_id");
    }

    const userCodes = userCode || req.user?.userCode;

    if (!userCodes) {
      return logger.error(res, "userCode is required");
    }

    const { sequelize, type, mapping } = await getTenantDB(userCodes);

    let SystemUserPermission;

    if (type === "TENANT") {
      SystemUserPermission = require("../../models/systemUserPermissions")(sequelize);
    } else {
      SystemUserPermission = db.system_user_permissions;
    }
    const deleted = await SystemUserPermission.destroy({
      where: { permission_id, role_id }
    });

    if (!deleted) {
      return logger.error(res, "Permission not found");
    }

    return logger.success(
      res,
      `Permission removed successfully from ${type} DB`
    );

  } catch (error) {
    logger.createLog(__filename, error.message, req);

    return logger.error(res, "Exception in drop ACL");
  }
};


// const getAcl = async (req, res) => {
//   try {

//     const permissions = await db.permissions.findAll({
//       attributes: ["id", "name", "key", "status"],
//       include: [
//         {
//           model: db.system_user_permissions,
//           as: "systemUserPermissions",
//           attributes: ["role_id"],
//           required: false
//         }
//       ],
//       order: [["id", "ASC"]]
//     });

//     return logger.success(res, "Permissions retrieved", permissions);

//   } catch (error) {
//     logger.createLog(__filename, error.message, req);
//     return logger.error(res, "Exception in get ACL");
//   }
// };

const getAcl = async (req, res) => {
  try {
    const { userCode } = req.body;
    const userCodes = userCode || req.user?.userCode;

    if (!userCodes) {
      return logger.error(res, "userCode is required");
    }

    const { sequelize, type, mapping } = await getTenantDB(userCodes);
    let SystemUserPermission;

    if (type === "TENANT") {
      console.log("👉 Using TENANT DB");
      SystemUserPermission = require("../../models/systemUserPermissions")(sequelize);
    } else {
      console.log("👉 Using MAIN DB");
      SystemUserPermission = db.system_user_permissions;
    }

    const permissions = await db.permissions.findAll({
      attributes: ["id", "name", "key", "status"],
      order: [["id", "ASC"]]
    });

    const mappings = await SystemUserPermission.findAll({
      attributes: ["permission_id", "role_id"]
    });

    // =============================
    // 🔥 MERGE DATA
    // =============================
    const result = permissions.map((perm) => {
      const assignedRoles = mappings
        .filter(m => m.permission_id === perm.id)
        .map(m => m.role_id);

      return {
        id: perm.id,
        name: perm.name,
        key: perm.key,
        status: perm.status,
        role_ids: assignedRoles   // ✅ important
      };
    });

    // =============================
    // ✅ RESPONSE
    // =============================
    return logger.success(
      res,
      `Permissions fetched from ${type} DB`,
      result
    );

  } catch (error) {
    console.error("❌ GET ACL ERROR:", error);
    logger.createLog(__filename, error.message, req);
    return logger.error(res, "Exception in get ACL");
  }
};



const createPermission = async (req, res) => {
  try {
    const { name, key, userCode } = req.body;

    if (!name || !key) {
      return logger.error(res, "name and key are required");
    }

    const userCodes = userCode || req.user?.userCode;

    
    console.log("userCodes :",userCodes)


    if (!userCodes) {
      return logger.error(res, "userCode is required");
    }

    const { sequelize, type } = await getTenantDB(userCodes);

    const Permission =
      type === "TENANT"
        ? require("../../models/permissions")(sequelize)
        : db.permissions;

    const exists = await db.permissions.findOne({ where: { key } });

    if (exists) {
      return logger.error(res, "Permission already exists");
    }

    // ✅ create
    const permission = await Permission.create({
      name,
      key,
      status: true
    });

    return logger.success(
      res,
      `Permission created in ${type} DB`,
      permission
    );

  } catch (error) {
    return logger.error(res, "Exception in permission create");
  }
};


// ==============================
// ✅ GET USER PERMISSIONS (RBAC)
// ==============================
const getUserPermissions = async (req, res) => {
  try {

    const roleId = req.user?.role_id;
    const userCode = req.user?.userCode;

    if (!roleId || !userCode) {
      return logger.error(res, "Invalid role or user");
    }

    // =============================
    // 🔥 GET TENANT DB
    // =============================
    const { sequelize, type } = await getTenantDB(userCode);

    let SystemUserPermission;

    if (type === "TENANT") {
      console.log("👉 Using TENANT DB");
      SystemUserPermission = require("../../models/systemUserPermissions")(sequelize);
    } else {
      SystemUserPermission = db.system_user_permissions;
    }

    // =============================
    // ✅ GET PERMISSION IDS
    // =============================
    const mappings = await SystemUserPermission.findAll({
      where: { role_id: roleId },
      attributes: ["permission_id"]
    });

    const permissionIds = mappings.map(p => p.permission_id);

    if (permissionIds.length === 0) {
      return logger.success(res, "No permissions found", {
        permissions: []
      });
    }

    // =============================
    // ✅ FETCH FROM MAIN DB
    // =============================
    const permissions = await db.permissions.findAll({
      where: {
        id: permissionIds,
        status: true
      },
      attributes: ["key"]
    });

    // =============================
    // ✅ EXTRACT KEYS
    // =============================
    const permissionKeys = permissions.map(p => p.key);

    return logger.success(res, "Permissions retrieved", {
      permissions: permissionKeys
    });

  } catch (error) {
    logger.createLog(__filename, error.message, req);
    return logger.error(res, "Exception in get user permissions");
  }
};


module.exports = {
  createAcl,
  dropAcl,
  getAcl,
  createPermission,
  getUserPermissions
};