const mongoose = require('mongoose');
const db = require('../../models/index');
const logger = require('../../../utils/winston');
const ObjectId = mongoose.Types.ObjectId;

const createRole = async function (req, res, next) {
  try {
    const { role } = req.body;

    if (typeof role === 'undefined') {
      return logger.error(res, "role parameter is missing.");
    }

    if (!role || role.trim() === "") {
      return logger.error(res, "role cannot be empty.");
    }

    const formattedRole = role.trim().toUpperCase();

    let roleData = await db.roles.findOne({
      where: {
        role: formattedRole,
        status: 'ACTIVE'
      }
    });

    console.log("roleData :", roleData);

    if (roleData) {
      return logger.error(res, 'Role already exists');
    }

    // attach formatted role if needed
    req.body.role = formattedRole;

    next();
  } catch (error) {
    logger.createLog(__filename, error.message, req);
    return logger.error(res, "Exception in role create");
  }
};

const createRoleByAdmin = async (req, res, next) => {
  try {
    let { role } = req.body;

    // 🔹 1. Required check
    if (!role) {
      return logger.error(res, "Role is required");
    }

    // 🔹 2. Trim
    role = role.trim();

    if (role.length === 0) {
      return logger.error(res, "Role cannot be empty");
    }

    // 🔹 3. Length validation
    if (role.length < 3 || role.length > 50) {
      return logger.error(res, "Role must be between 3 to 50 characters");
    }

    // 🔹 4. Format validation
    const roleRegex = /^[A-Za-z_ ]+$/;
    if (!roleRegex.test(role)) {
      return logger.error(res, "Role can only contain letters, spaces, and underscores");
    }

    // 🔥 5. Normalize properly
    const formattedRole = role
      .replace(/\s+/g, "_")     // convert spaces → underscore
      .toUpperCase();

    // 🔹 6. Tenant check
    const tenant_id = req.user?.tenant_id;
    if (!tenant_id) {
      return logger.error(res, "Tenant not found");
    }

    // 🔥 7. Duplicate check (clean + optimized)
    const existingRole = await db.roles.findOne({
      where: {
        role: formattedRole,   // no need iLike now
        tenant_id,
        status: "ACTIVE"
      }
    });

    if (existingRole) {
      return logger.error(res, "Role already exists for this tenant");
    }

    // 🔹 8. Pass cleaned value
    req.body.role = formattedRole;

    next();

  } catch (error) {
    logger.createLog(__filename, error.message, req);
    return logger.error(res, "Exception in role validation");
  }
};


const updateRole = async function (req, res, next) {
  try {
    // Validate presence of required fields
    const { role_id, role } = req.body;
    if (typeof role_id === 'undefined' || typeof role === 'undefined') {
      return logger.error(res, "role_id or role parameter is missing.");
    }

    if (!role_id || !role) {
      return logger.error(res, "role_id or role cannot be empty.");
    }

    // Validate role_id format
    if (!mongoose.Types.ObjectId.isValid(role_id)) {
      return logger.error(res, "Invalid role_id format. It should be 24 characters only");
    }

    // Check if role_id exists and is active
    let existingRole = await db.roles.findById(role_id);
    if (!existingRole || !existingRole.status) {
      return logger.error(res, 'Role ID not in the list or already inactive');
    }

    // Check if new role name already exists
    let roleExists = await db.roles.findOne({ role: role, status: true });
    if (roleExists && roleExists._id.toString() !== role_id) {
      return logger.error(res, 'Role with this name already exists');
    }
    next();
  } catch (error) {
    logger.createLog(__filename, error.message, req);
    return logger.error(res, "Exception in role update");
  }
};

const deleteRole = async function (req, res, next) {
    try {
      // Validate presence of required fields
      const { role_id } = req.body;
      if (typeof role_id === 'undefined') {
        return logger.error(res, "role_id parameter is missing.");
      }
  
      if (!role_id) {
        return logger.error(res, "role_id cannot be empty.");
      }
  
      // Validate role_id format
      if (!mongoose.Types.ObjectId.isValid(role_id)) {
        return logger.error(res, "Invalid role_id format. It should be 24 characters only.");
      }
  
      // Check if role exists and is active
      let existingRole = await db.roles.findById(role_id);
      if (!existingRole) {
        return logger.error(res, 'Role ID not in the list');
      }
  
      if (!existingRole.status) {
        return logger.error(res, 'Role is already deleted.');
      }
      next();
    } catch (error) {
      logger.createLog(__filename, error.message, req);
      return logger.error(res, "Exception in role delete");
    }
  };

  
module.exports = { createRole,updateRole,deleteRole};