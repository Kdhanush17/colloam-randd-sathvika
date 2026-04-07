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
const { Workspace, TeamMember, Role, WorkflowStage } = require("../../models"); // Updated import
const { SYSTEM_ROLES, DEFAULT_WORKFLOW_STAGES, USER_STATUS } = require("../../../utils/constants");
const { generateTokens, verifyRefreshToken } = require("../../../utils/jwt");
const { getTenantConnection } = require("../../../utils/tenantConnectionManager");

// Helper functions for default stages
const getStageColor = (index) => {
  const colors = ["#FFC107", "#00BCD4", "#8BC34A", "#FF5722", "#673AB7", "#E91E63", "#009688", "#795548"];
  return colors[index % colors.length];
};

const getStageIcon = (index) => {
  const icons = ["idea", "script", "shoot", "edit", "upload", "seo", "publish", "revenue"];
  return icons[index % icons.length];
};

let tokencheck = async function (req, res, next) {
  res.json({
    status: true,
    message: "Token verified successfully",
    tokenDetails: {
      user: req.user,
      timestamp: new Date(),
      authenticated: true
    }
  });
};

// =============================
// 📌 HELPER: CREATE SYSTEM ROLES IN MAIN DB
// =============================
const createSystemRolesInMainDB = async () => {
  try {
    const roleEntries = Object.values(SYSTEM_ROLES);

    for (const roleName of roleEntries) {
      const roleExists = await db.roles.findOne({
        where: { role: roleName }
      });

      if (!roleExists) {
        await db.roles.create({
          role: roleName,
          description: `System role: ${roleName}`,
          status: 'ACTIVE'
        });
        console.log(`✅ Created system role: ${roleName}`);
      }
    }

    return true;
  } catch (error) {
    console.error("❌ Error creating system roles in main DB:", error.message);
    throw error;
  }
};

// =============================
// 📌 HELPER: GET OR CREATE PERMISSION IN MAIN DB
// =============================
const getOrCreatePermission = async (resource, action) => {
  try {
    const permissionName = `${resource}-${action}`;
    const permissionKey = `${resource}:${action}`;

    // Check if permission already exists
    let permission = await db.permissions.findOne({
      where: { key: permissionKey }
    });

    if (!permission) {
      permission = await db.permissions.create({
        name: permissionName,
        key: permissionKey,
        status: true,
        createdAt: new Date()
      });
      console.log(`✅ Created permission: ${permissionName}`);
    }

    return permission.id; // Return the permission_id
  } catch (error) {
    console.error("❌ Error creating/fetching permission:", error.message);
    throw error;
  }
};

// =============================
// 📌 HELPER: CREATE DEFAULT PERMISSIONS FOR ROLE IN MAIN DB
// =============================
const createDefaultPermissionsForRole = async (roleId, roleName) => {
  try {
    const rolePermissions = {
      [SYSTEM_ROLES.ADMIN]: [
        { resource: "dashboard", action: "access", granted: true },
        { resource: "my_tasks", action: "access", granted: true },
        { resource: "production_board", action: "access", granted: true },
        { resource: "planning", action: "access", granted: true },
        { resource: "finance", action: "access", granted: true },
        { resource: "team_management", action: "access", granted: true },
        { resource: "ticketing_system", action: "access", granted: true },
        { resource: "storage", action: "access", granted: true },
        { resource: "billing", action: "access", granted: true },
        { resource: "settings", action: "access", granted: true },
        { resource: "content", action: "create", granted: true },
        { resource: "content", action: "read", granted: true },
        { resource: "content", action: "update", granted: true },
        { resource: "content", action: "delete", granted: true },
        { resource: "content", action: "move", granted: true },
        { resource: "task", action: "create", granted: true },
        { resource: "task", action: "read", granted: true },
        { resource: "task", action: "update", granted: true },
        { resource: "task", action: "delete", granted: true },
        { resource: "team", action: "invite", granted: true },
        { resource: "team", action: "manage", granted: true },
        { resource: "workspace", action: "settings", granted: true },
        { resource: "storage", action: "upload", granted: true },
        { resource: "storage", action: "delete", granted: true },
        { resource: "billing", action: "manage", granted: true },
      ],
      [SYSTEM_ROLES.SUPER_ADMIN]: [
        { resource: "dashboard", action: "access", granted: true },
        { resource: "my_tasks", action: "access", granted: true },
        { resource: "production_board", action: "access", granted: true },
        { resource: "planning", action: "access", granted: true },
        { resource: "finance", action: "access", granted: true },
        { resource: "team_management", action: "access", granted: true },
        { resource: "ticketing_system", action: "access", granted: true },
        { resource: "storage", action: "access", granted: true },
        { resource: "billing", action: "access", granted: true },
        { resource: "settings", action: "access", granted: true },
        { resource: "content", action: "create", granted: true },
        { resource: "content", action: "read", granted: true },
        { resource: "content", action: "update", granted: true },
        { resource: "content", action: "delete", granted: true },
        { resource: "content", action: "move", granted: true },
        { resource: "task", action: "create", granted: true },
        { resource: "task", action: "read", granted: true },
        { resource: "task", action: "update", granted: true },
        { resource: "task", action: "delete", granted: true },
        { resource: "team", action: "invite", granted: true },
        { resource: "team", action: "manage", granted: true },
        { resource: "workspace", action: "settings", granted: true },
        { resource: "storage", action: "upload", granted: true },
        { resource: "storage", action: "delete", granted: true },
        { resource: "billing", action: "manage", granted: true },
      ],
      [SYSTEM_ROLES.CONTENT_MANAGER]: [
        { resource: "dashboard", action: "access", granted: true },
        { resource: "my_tasks", action: "access", granted: true },
        { resource: "production_board", action: "access", granted: true },
        { resource: "planning", action: "access", granted: true },
        { resource: "finance", action: "access", granted: true },
        { resource: "storage", action: "access", granted: true },
        { resource: "team_management", action: "access", granted: true },
        { resource: "content", action: "create", granted: true },
        { resource: "content", action: "read", granted: true },
        { resource: "content", action: "update", granted: true },
        { resource: "content", action: "move", granted: true },
        { resource: "task", action: "create", granted: true },
        { resource: "task", action: "read", granted: true },
        { resource: "task", action: "update", granted: true },
        { resource: "storage", action: "upload", granted: true },
      ],
      [SYSTEM_ROLES.EDITOR]: [
        { resource: "dashboard", action: "access", granted: true },
        { resource: "my_tasks", action: "access", granted: true },
        { resource: "production_board", action: "access", granted: true },
        { resource: "planning", action: "access", granted: true },
        { resource: "storage", action: "access", granted: true },
        { resource: "content", action: "read", granted: true },
        { resource: "content", action: "update", granted: true },
        { resource: "task", action: "read", granted: true },
      ],
      [SYSTEM_ROLES.SEO_MANAGER]: [
        { resource: "dashboard", action: "access", granted: true },
        { resource: "my_tasks", action: "access", granted: true },
        { resource: "production_board", action: "access", granted: true },
        { resource: "planning", action: "access", granted: true },
        { resource: "content", action: "read", granted: true },
        { resource: "content", action: "update", granted: true },
        { resource: "analytics", action: "view", granted: true },
      ],
      [SYSTEM_ROLES.VIEWER]: [
        { resource: "dashboard", action: "access", granted: true },
        { resource: "my_tasks", action: "access", granted: true },
        { resource: "content", action: "read", granted: true },
        { resource: "task", action: "read", granted: true },
        { resource: "analytics", action: "view", granted: true },
      ],
    };

    const permissionsToCreate = rolePermissions[roleName] || [];

    for (const permission of permissionsToCreate) {
      // Get or create permission in main DB and get its ID
      const permissionId = await getOrCreatePermission(permission.resource, permission.action);

      // Create system_user_permission entry
      await db.system_user_permissions.create({
        role_id: roleId,
        permission_id: permissionId, // Use actual permission_id from permissions table
        resource: permission.resource,
        action: permission.action,
        granted: permission.granted,
      });
    }

    console.log(`✅ Default permissions created for role: ${roleName}`);
  } catch (error) {
    console.error("❌ Error creating default permissions:", error.message);
    throw error;
  }
};

const superAdminCreate = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // ==============================
    // ✅ VALIDATION
    // ==============================
    if (!username || !email || !password) {
      return logger.error(res, "All fields are required");
    }

    // ==============================
    // 🔥 CREATE SYSTEM ROLES IN MAIN DB (if not exist)
    // ==============================
    await createSystemRolesInMainDB();

    // ==============================
    // ✅ GET SUPER_ADMIN ROLE FROM MAIN DB
    // ==============================
    const superAdminRole = await db.roles.findOne({
      where: { role: SYSTEM_ROLES.SUPER_ADMIN }
    });

    if (!superAdminRole || superAdminRole.status !== "ACTIVE") {
      return logger.error(res, "SUPER_ADMIN role not found or inactive");
    }

    // ==============================
    // ✅ CHECK EMAIL DUPLICATE
    // ==============================
    const existingUser = await db.super_admins.findOne({
      where: { email }
    });

    if (existingUser) {
      return logger.error(res, "Email already exists");
    }

    // ==============================
    // 🔥 GENERATE UNIQUE superAdminCode
    // ==============================
    const generateSuperAdminCode = async () => {
      let isUnique = false;
      let code;

      while (!isUnique) {
        const now = new Date();

        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");

        const prefix = `SA_${year}${month}_`;

        // 🔹 Random 4-digit
        const random = Math.floor(1000 + Math.random() * 9000);

        code = `${prefix}${random}`;

        // 🔹 Check DB uniqueness
        const exists = await db.super_admins.findOne({
          where: { superAdminCode: code }
        });

        if (!exists) {
          isUnique = true;
        }
      }

      return code;
    };

    const superAdminCode = await generateSuperAdminCode();

    // ==============================
    // ✅ HASH PASSWORD
    // ==============================
    const hash = await bcrypt.hash(password, env.saltRounds);

    // ==============================
    // ✅ CREATE SUPER ADMIN WITH SUPER_ADMIN ROLE
    // ==============================
    const admin = await db.super_admins.create({
      superAdminCode,
      username,
      email,
      password: hash,
      role_id: superAdminRole.role_id,
      role_name: superAdminRole.role,
      created_at: new Date(),
      status: true
    });

    // ==============================
    // 🔥 CREATE DEFAULT PERMISSIONS FOR SUPER_ADMIN ROLE
    // ==============================
    await createDefaultPermissionsForRole(superAdminRole.role_id, SYSTEM_ROLES.SUPER_ADMIN);

    return logger.success(res, "Super Admin created successfully", admin);

  } catch (error) {
    logger.createLog(__filename, error.message, req);
    return logger.error(res, "Exception in creating Super Admin");
  }
};

const updateSuperAdmin = async (req, res) => {
  try {
    const { superAdminCode } = req.params;
    const { username, email, role_id, password, status } = req.body;

    // ==============================
    // ✅ FIND USER
    // ==============================
    const existingUser = await db.super_admins.findOne({
      where: { superAdminCode }
    });

    if (!existingUser) {
      return logger.error(res, "Super Admin not found");
    }

    // ==============================
    // ✅ EMAIL DUPLICATE CHECK
    // ==============================
    if (email && email !== existingUser.email) {
      const emailExists = await db.super_admins.findOne({
        where: { email }
      });

      if (emailExists) {
        return logger.error(res, "Email already exists");
      }
    }

    // ==============================
    // ✅ ROLE CHECK
    // ==============================
    let roleName = existingUser.role_name;

    if (role_id) {
      const role = await db.roles.findByPk(role_id);

      if (!role || role.status !== "ACTIVE") {
        return logger.error(res, "Invalid or inactive role_id");
      }

      roleName = role.role;
    }

    // ==============================
    // ✅ PASSWORD HASH (OPTIONAL)
    // ==============================
    let hashedPassword = existingUser.password;

    if (password) {
      hashedPassword = await bcrypt.hash(password, env.saltRounds);
    }

    // ==============================
    // ✅ UPDATE
    // ==============================
    await db.super_admins.update(
      {
        username: username || existingUser.username,
        email: email || existingUser.email,
        password: hashedPassword,
        role_id: role_id || existingUser.role_id,
        role_name: roleName,
        status: status !== undefined ? status : existingUser.status,
        updated_at: new Date()
      },
      {
        where: { superAdminCode }
      }
    );

    const updatedUser = await db.super_admins.findOne({
      where: { superAdminCode }
    });

    return logger.success(res, "Super Admin updated successfully", updatedUser);

  } catch (error) {
    logger.createLog(__filename, error.message, req);
    return logger.error(res, "Exception in updating Super Admin");
  }
};

const deleteSuperAdmin = async (req, res) => {
  try {
    const { superAdminCode } = req.params;

    const user = await db.super_admins.findOne({
      where: { superAdminCode }
    });

    if (!user) {
      return logger.error(res, "Super Admin not found");
    }

    await db.super_admins.update(
      {
        status: false,
        updated_at: new Date()
      },
      {
        where: { superAdminCode }
      }
    );

    return logger.success(res, "Super Admin deleted successfully (soft)");

  } catch (error) {
    logger.createLog(__filename, error.message, req);
    return logger.error(res, "Exception in deleting Super Admin");
  }
};

// =============================
// 📧 EMAIL RETRY FUNCTION
// =============================
const sendEmailWithRetry = (emailData, maxRetries = 2, interval = 5000) => {
  let attempts = 0;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const intervalId = setInterval(async () => {
    try {
      attempts++;
      console.log(`📧 Email attempt ${attempts}`);

      await transporter.sendMail(emailData);

      console.log("✅ Email sent successfully");
      clearInterval(intervalId);

    } catch (error) {
      console.error(`❌ Email attempt ${attempts} failed:`, error.message);

      if (attempts >= maxRetries) {
        console.log("🚫 Email failed after max retries");
        clearInterval(intervalId);
      }
    }
  }, interval);
};

const UserSignup = async (req, res) => {
  let transaction;
  let tenantDbName = null;
  let dbUsername = null;
  let tenantSequelize;

  try {
    // Validate res object exists and has required methods
    if (!res || typeof res.status !== 'function') {
      console.error('❌ Invalid response object:', typeof res);
      return;
    }

    const {
      email,
      password,
      full_name,
      workspace_name,
      workspace_type,
      team_size,
      publishing_frequency,
      isEmailVerified
    } = req.body;

    // =============================
    // ✅ VALIDATION
    // =============================
    if (!email || !password || !full_name || !workspace_name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await db.user_account.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // =============================
    // ✅ SLUG VALIDATION
    // =============================
    const baseSlug = generateSlug(workspace_name);
    const slugValidation = validateSlug(baseSlug);

    if (!slugValidation.success) {
      throw new Error(`Invalid workspace name: ${slugValidation.errors.join(", ")}`);
    }

    const tenant_id = `TENANT-${Date.now()}`;
    const formattedWorkspace = workspace_name.toLowerCase().replace(/\s+/g, "_");

    tenantDbName = `tenant_${formattedWorkspace}`;
    dbUsername = `user_${formattedWorkspace}`;
    const dbPassword = `Pass@${formattedWorkspace}`;

    // =============================
    // 🚨 CREATE TENANT DB
    // =============================
    const rootSequelize = new Sequelize(
      env.dbName,
      env.dbUserName,
      env.dbPassword,
      {
        host: env.host,
        dialect: "postgres",
        logging: false
      }
    );

    await rootSequelize.query(`CREATE DATABASE \"${tenantDbName}\"`);

    const [userExists] = await rootSequelize.query(
      `SELECT 1 FROM pg_roles WHERE rolname = '${dbUsername}'`
    );

    if (userExists.length === 0) {
      await rootSequelize.query(`CREATE USER ${dbUsername} WITH PASSWORD '${dbPassword}'`);
    }

    await rootSequelize.query(
      `GRANT ALL PRIVILEGES ON DATABASE \"${tenantDbName}\" TO ${dbUsername}`
    );

    // =============================
    // 🔓 SCHEMA PERMISSION
    // =============================
    const tempTenantSequelize = new Sequelize(
      tenantDbName,
      env.dbUserName,
      env.dbPassword,
      {
        host: env.host,
        dialect: "postgres",
        logging: false
      }
    );

    await tempTenantSequelize.query(`GRANT ALL ON SCHEMA public TO ${dbUsername}`);
    await tempTenantSequelize.close();

    // =============================
    // CONNECT TENANT DB
    // =============================
    tenantSequelize = new Sequelize(
      tenantDbName,
      dbUsername,
      dbPassword,
      {
        host: env.host,
        dialect: "postgres",
        logging: false
      }
    );

    const models = await initTenantDB(tenantSequelize);

    // =============================
    // ✅ START TRANSACTION
    // =============================
    transaction = await db.sequelize.transaction();

    const now = new Date();

    // =============================
    // 🔥 ENSURE SYSTEM ROLES EXIST IN MAIN DB
    // =============================
    await createSystemRolesInMainDB();

    // =============================
    // ✅ GET ADMIN ROLE FROM MAIN DB
    // =============================
    const adminRole = await db.roles.findOne({
      where: { role: SYSTEM_ROLES.ADMIN }
    });

    if (!adminRole) {
      throw new Error("ADMIN role not found in main database");
    }

    // =============================
    // ✅ CREATE USER (MAIN DB)
    // =============================
    const user = await db.user_account.create({
      // ❌ REMOVE uuidv4 manual
      verify_code: `ADMIN-${full_name}-${workspace_name}-${now.getTime()}`,
      full_name,
      email,
      password: hashedPassword,
      workspace_name,
      tenant_db: tenantDbName,
      role_id: adminRole.role_id, // 🔑 SAME role_id from main DB
      role_name: adminRole.role, // 🔑 SAME role_name from main DB
      status: USER_STATUS.ACTIVE,
      isEmailVerified: isEmailVerified || false,
      trial_start_date: new Date(),
      trial_end_date: new Date(Date.now() + env.trial.durationDays * 86400000)
    }, { transaction });

    let finalSlug = baseSlug;

    const existingSlug = await db.Workspace.findOne({ where: { slug: baseSlug } });
    if (existingSlug) {
      finalSlug = generateUniqueSlug(baseSlug, 1);
    }

    const workspace = await db.Workspace.create({
      owner_id: user.userCode, // ✅ FK SAFE
      name: workspace_name,
      slug: finalSlug,
      workspace_type: workspace_type || "individual",
      team_size,
      publishing_frequency,
      trial_started_at: new Date(),
      trial_expires_at: new Date(Date.now() + env.trial.durationDays * 86400000),
    }, { transaction });

    // =============================
    // ✅ CREATE MAPPING
    // =============================
    const mapping = await db.database_mappings.create({
      email,
      userCode: user.userCode,
      workspace_id: workspace.workspace_id,
      database: tenantDbName,
      db_username: dbUsername,
      db_password: dbPassword,
      db_host: env.host,
      db_port: 5432
    }, { transaction });

    // =============================
    // ✅ CREATE WORKSPACE (MAIN DB)  ⭐ FIXED
    // =============================


    // =============================
    // ✅ COMMIT BEFORE TENANT OPS
    // =============================
    await transaction.commit();

    // =============================
    // ✅ CREATE WORKSPACE (TENANT DB)
    // =============================

    await models.Workspace.create({
      workspace_id: workspace.workspace_id,
      owner_id: user.userCode,
      name: workspace_name,
      slug: finalSlug,
      workspace_type: workspace_type || "individual",
      team_size,
      publishing_frequency,
      trial_started_at: new Date(),
      trial_expires_at: new Date(Date.now() + env.trial.durationDays * 86400000),
    });

    // =============================
    // ✅ CREATE USER IN TENANT DB
    // =============================
    const tenantUser = await models.user_account.create({
      userCode: user.userCode,
      full_name: user.full_name,
      email: user.email,
      password: user.password,
      workspace_id: workspace.workspace_id,
      workspace_name: user.workspace_name,
      role_id: adminRole.role_id, // 🔑 SAME role_id from main DB
      role_name: adminRole.role, // 🔑 SAME role_name from main DB
      status: USER_STATUS.ACTIVE,
      isEmailVerified: user.isEmailVerified,
      trial_start_date: user.trial_start_date,
      trial_end_date: user.trial_end_date
    });

    await db.user_account.update(
      {
        workspace_id: workspace.workspace_id
      },
      {
        where: {
          userCode: user.userCode
        }
      }
    );

    // =============================
    // ✅ DEFAULT DATA
    // =============================
    await createDefaultRoles(models, workspace.workspace_id);
    await createDefaultStages(models, workspace.workspace_id);

    // =============================
    // ✅ GET ADMIN ROLE FROM TENANT DB (now created from main DB)
    // =============================
    const tenantAdminRole = await models.roles.findOne({
      where: {
        workspace_id: workspace.workspace_id,
        role: SYSTEM_ROLES.ADMIN,
      },
    });

    await models.TeamMember.create({
      workspace_id: workspace.workspace_id,
      user_id: tenantUser.userCode,
      role_id: tenantAdminRole.role_id,
      invited_by: null,
    });

    // =============================
    // ✅ TOKENS
    // =============================
    const tokens = generateTokens(
      user.userCode,
      workspace.workspace_id,
      SYSTEM_ROLES.ADMIN,
      user.email
    );

    return res.status(201).json({
      message: "Signup successful",
      user,
      mapping,
      workspace: {
        workspace_id: workspace.workspace_id,
        name: workspace.name,
        slug: workspace.slug,
      },
      tokens,
    });

  } catch (error) {
    console.error("❌ Signup Error:", error);

    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }

    // ❌ CLEANUP DB
    if (tenantSequelize) {
      try {
        // await tenantSequelize.close();
      } catch (closeErr) {
        console.error("Error closing tenant DB:", closeErr.message);
      }
    }

    if (tenantDbName) {
      try {
        const rootSequelize = new Sequelize(
          env.dbName,
          env.dbUserName,
          env.dbPassword,
          {
            host: env.host,
            dialect: "postgres",
            logging: false
          }
        );

        await rootSequelize.query(`
          SELECT pg_terminate_backend(pid)
          FROM pg_stat_activity
          WHERE datname = '${tenantDbName}'
        `);

        await rootSequelize.query(`DROP DATABASE IF EXISTS \"${tenantDbName}\"`);
        await rootSequelize.close();

      } catch (err) {
        console.error("Cleanup failed:", err.message);
      }
    }

    // Safely send error response
    try {
      if (res && typeof res.status === 'function') {
        return res.status(500).json({
          message: error.message || "Internal Server Error"
        });
      } else {
        console.error("❌ Cannot send response - res.status is not available");
      }
    } catch (responseError) {
      console.error("❌ Error sending response:", responseError.message);
    }
  }
};

AWS.config.update({ region: env.awsRegion });
const s3 = new AWS.S3();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, env.profilePicUploadPath);
  },
  filename: function (req, file, cb) {
    req.uploadfilename = req.user._id + "_" + Date.now();
    req.originalname = file.originalname;
    cb(null, req.uploadfilename + ".jpg");
  }
});

const maxSize = 3 * 1000 * 1000;
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: maxSize },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }

    cb("Error: File upload only supports the following filetypes - " + filetypes);
  },
}).single("mypic");

const createDefaultRoles = async (tenantModels, workspaceId) => {
  try {
    // ==============================
    // 🔥 GET SYSTEM ROLES FROM MAIN DB
    // ==============================
    const mainDBRoles = await db.roles.findAll({
      where: { role: Object.values(SYSTEM_ROLES) }
    });

    if (mainDBRoles.length === 0) {
      // Create system roles in main DB if they don't exist
      await createSystemRolesInMainDB();
      // Fetch again
      return await createDefaultRoles(tenantModels, workspaceId);
    }

    // ==============================
    // ✅ CREATE ROLES IN TENANT DB WITH SAME role_id AND role_name FROM MAIN DB
    // ==============================
    for (const mainRole of mainDBRoles) {
      const role = await tenantModels.roles.create({
        role_id: mainRole.role_id, // 🔑 SAME role_id from main DB
        workspace_id: workspaceId,
        role: mainRole.role, // 🔑 SAME role_name from main DB
        description: mainRole.description || `System role: ${mainRole.role}`,
        status: "ACTIVE"
      });

      // Assign default permissions based on role in tenant DB
      await assignDefaultPermissions(tenantModels, role.role_id, mainRole.role);
    }

    console.log(`✅ Default roles created for tenant workspace: ${workspaceId}`);
  } catch (error) {
    console.error("❌ Error creating default roles for tenant DB:", error.message);
    throw error;
  }

  console.log(`✅ Default roles created for tenant workspace: ${workspaceId}`);
}

// =============================
// 📌 HELPER: GET OR CREATE PERMISSION IN TENANT DB
// =============================
const getTenantOrCreatePermission = async (tenantModels, resource, action) => {
  try {
    const permissionName = `${resource}-${action}`;
    const permissionKey = `${resource}:${action}`;

    // Check if permission already exists in tenant DB
    let permission = await tenantModels.permissions.findOne({
      where: { key: permissionKey }
    });

    if (!permission) {
      permission = await tenantModels.permissions.create({
        name: permissionName,
        key: permissionKey,
        status: true,
        createdAt: new Date()
      });
      console.log(`✅ Created tenant permission: ${permissionName}`);
    }

    return permission.id; // Return the permission_id
  } catch (error) {
    console.error("❌ Error creating/fetching tenant permission:", error.message);
    throw error;
  }
};

const assignDefaultPermissions = async (tenantModels, roleId, roleName) => {
  try {
    const rolePermissions = {
      [SYSTEM_ROLES.ADMIN]: [
        { resource: "dashboard", action: "access", granted: true },
        { resource: "my_tasks", action: "access", granted: true },
        { resource: "production_board", action: "access", granted: true },
        { resource: "planning", action: "access", granted: true },
        { resource: "finance", action: "access", granted: true },
        { resource: "team_management", action: "access", granted: true },
        { resource: "ticketing_system", action: "access", granted: true },
        { resource: "storage", action: "access", granted: true },
        { resource: "billing", action: "access", granted: true },
        { resource: "settings", action: "access", granted: true },
        { resource: "content", action: "create", granted: true },
        { resource: "content", action: "read", granted: true },
        { resource: "content", action: "update", granted: true },
        { resource: "content", action: "delete", granted: true },
        { resource: "content", action: "move", granted: true },
        { resource: "task", action: "create", granted: true },
        { resource: "task", action: "read", granted: true },
        { resource: "task", action: "update", granted: true },
        { resource: "task", action: "delete", granted: true },
        { resource: "team", action: "invite", granted: true },
        { resource: "team", action: "manage", granted: true },
        { resource: "workspace", action: "settings", granted: true },
        { resource: "storage", action: "upload", granted: true },
        { resource: "storage", action: "delete", granted: true },
        { resource: "billing", action: "manage", granted: true },
      ],
      [SYSTEM_ROLES.CONTENT_MANAGER]: [
        { resource: "dashboard", action: "access", granted: true },
        { resource: "my_tasks", action: "access", granted: true },
        { resource: "production_board", action: "access", granted: true },
        { resource: "planning", action: "access", granted: true },
        { resource: "finance", action: "access", granted: true },
        { resource: "storage", action: "access", granted: true },
        { resource: "team_management", action: "access", granted: true },
        { resource: "content", action: "create", granted: true },
        { resource: "content", action: "read", granted: true },
        { resource: "content", action: "update", granted: true },
        { resource: "content", action: "move", granted: true },
        { resource: "task", action: "create", granted: true },
        { resource: "task", action: "read", granted: true },
        { resource: "task", action: "update", granted: true },
        { resource: "storage", action: "upload", granted: true },
      ],
      [SYSTEM_ROLES.EDITOR]: [
        { resource: "dashboard", action: "access", granted: true },
        { resource: "my_tasks", action: "access", granted: true },
        { resource: "production_board", action: "access", granted: true },
        { resource: "planning", action: "access", granted: true },
        { resource: "storage", action: "access", granted: true },
        { resource: "content", action: "read", granted: true },
        { resource: "content", action: "update", granted: true },
        { resource: "task", action: "read", granted: true },
      ],
      [SYSTEM_ROLES.SEO_MANAGER]: [
        { resource: "dashboard", action: "access", granted: true },
        { resource: "my_tasks", action: "access", granted: true },
        { resource: "production_board", action: "access", granted: true },
        { resource: "planning", action: "access", granted: true },
        { resource: "content", action: "read", granted: true },
        { resource: "content", action: "update", granted: true },
        { resource: "analytics", action: "view", granted: true },
      ],
      [SYSTEM_ROLES.VIEWER]: [
        { resource: "dashboard", action: "access", granted: true },
        { resource: "my_tasks", action: "access", granted: true },
        { resource: "content", action: "read", granted: true },
        { resource: "task", action: "read", granted: true },
        { resource: "analytics", action: "view", granted: true },
      ],
    };

    const permissionsToCreate = rolePermissions[roleName] || [];

    for (const permission of permissionsToCreate) {
      // Get or create permission in tenant DB and get its ID
      const permissionId = await getTenantOrCreatePermission(tenantModels, permission.resource, permission.action);

      // Create system_user_permission entry with actual permission_id
      await tenantModels.system_user_permissions.create({
        role_id: roleId,
        permission_id: permissionId, // Use actual permission_id from permissions table
        resource: permission.resource,
        action: permission.action,
        granted: permission.granted,
      });
    }

    console.log(`✅ Default permissions created for tenant role: ${roleName}`);
  } catch (error) {
    console.error("❌ Error assigning default permissions for tenant DB:", error.message);
    throw error;
  }
}

const createDefaultStages = async (tenantModels, workspaceId) => {
  try {
    const stages = [];

    for (let i = 0; i < DEFAULT_WORKFLOW_STAGES.length; i++) {
      const stage = await tenantModels.WorkflowStage.create({
        workspace_id: workspaceId,
        name: DEFAULT_WORKFLOW_STAGES[i],
        order: i + 1,
        is_system: true,
        color: getStageColor(i),
        icon: getStageIcon(i),
      });
      stages.push(stage);
    }

    console.log(`✅ Default workflow stages created for tenant workspace: ${workspaceId}`);
    return stages;
  } catch (error) {
    console.error("❌ Create default stages error for tenant DB:", error.message);
    throw error;
  }
}
const unifiedLogin = async (req, res) => {
  try {
    let { email, password } = req.body;

    // =========================
    // ✅ VALIDATION
    // =========================
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    email = email.toLowerCase();

    let user = null;
    let role = null;
    let role_id = null;
    let name = "";
    let database = "";
    let userCodeValue = null;
    let workspace_id = null;
    let isSuperAdmin = false;
    let tenant_db = null;

    // =========================
    // 🔹 STEP 1: CHECK SUPER ADMIN
    // =========================
    user = await db.super_admins.findOne({
      where: { email, status: true }
    });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid password" });
      }

      isSuperAdmin = true;
      role = user.role_name || "SUPER_ADMIN";
      role_id = user.role_id;
      name = user.username;
      database = "MAIN_DB";
      userCodeValue = user.superAdminCode;

      // =============================
      // ✅ CAPTURE DEVICE LOGIN (SUPER ADMIN)
      // =============================
      const deviceDetails = captureDeviceDetails(req);
      const deviceToken = generateDeviceToken();
      const now = new Date();

      try {
        await db.device_login.create({
          user_id: user.id,
          userCode: userCodeValue,
          device_name: deviceDetails.device_name,
          device_type: deviceDetails.device_type,
          browser_name: deviceDetails.browser_name,
          browser_version: deviceDetails.browser_version,
          os_name: deviceDetails.os_name,
          os_version: deviceDetails.os_version,
          ip_address: deviceDetails.ip_address,
          user_agent: deviceDetails.user_agent,
          device_token: deviceToken,
          last_login_at: now,
          last_activity_at: now,
          login_count: 1,
          is_active: true
        });
        console.log(`✅ Device login tracked for super admin: ${user.email}`);
      } catch (deviceError) {
        console.warn(`⚠️  Device tracking failed for super admin:`, deviceError.message);
        // Don't fail login if device tracking fails
      }

      // Generate tokens for super admin (with email included)
      const tokens = generateTokens(userCodeValue, null, role, user.email);

      return res.status(200).json({
        message: "Login successful",
        tokens,
        database,
        user: {
          id: user.id,
          email,
          role,
          role_id,
          name,
          userCode: userCodeValue,
          isSuperAdmin: true
        }
      });
    }

    // =========================
    // 🔹 STEP 2: CHECK TENANT USER - DATABASE MAPPING
    // =========================
    const normalizedEmail = email.toLowerCase();
    const dbMapping = await db.database_mappings.findOne({
      where: {
        status: true,
        [Op.or]: [
          { email: normalizedEmail },
          Sequelize.literal(`
            EXISTS (
              SELECT 1
              FROM jsonb_array_elements(users) AS "user"
              WHERE LOWER("user"->>'email') = '${normalizedEmail}'
            )
          `)
        ]
      }
    });

    if (!dbMapping) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    try {
      tenantSequelize = await getTenantConnection(dbMapping);

      let TenantUser;

      if (!tenantSequelize.models.user_account) {
        TenantUser = require("../../models/userAccount")(tenantSequelize);
      } else {
        TenantUser = tenantSequelize.models.user_account;
      }
      let TenantTeamMember;

      if (!tenantSequelize.models.TeamMember) {
        TenantTeamMember = require("../../models/TeamMember")(tenantSequelize);
      } else {
        TenantTeamMember = tenantSequelize.models.TeamMember;
      }

      // =========================
      // 🔹 STEP 3A: CHECK IN USER ACCOUNT (ADMIN/OWNER)
      // =========================
      user = await TenantUser.findOne({
        where: { email }
      });

      // =========================
      // 🔹 STEP 3B: IF NOT FOUND, CHECK IN TEAM MEMBER
      // =========================
      let isTeamMember = false;
      if (!user) {
        const teamMember = await TenantTeamMember.findOne({
          where: { email, status: true },
          include: {
            association: "user",
            model: TenantUser,
            where: { status: true }
          }
        });

        if (teamMember && teamMember.user) {
          user = teamMember.user;
          isTeamMember = true;
        }
      }

      if (!user) {
        // await tenantSequelize.close();
        return res.status(404).json({
          message: "User not found in tenant DB"
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        // await tenantSequelize.close();
        return res.status(401).json({
          message: "Invalid password"
        });
      }

      // =========================
      // 🔹 STEP 4: GET WORKSPACE DETAILS
      // =========================
      workspace_id = dbMapping.workspace_id;
      console.log("Mapped workspace ID:", workspace_id);

      const TenantWorkspace = require("../../models/Workspace")(tenantSequelize);
      const workspace = await TenantWorkspace.findOne({
        where: { workspace_id }
      });

      if (!workspace) {
        // await tenantSequelize.close();
        return res.status(404).json({
          message: "Workspace not found"
        });
      }

      role = user.role_name;
      role_id = user.role_id;
      name = user.full_name;
      database = dbMapping.database;
      userCodeValue = user.userCode;
      email = user.email;
      tenant_db = dbMapping.database;

      // =============================
      // ✅ CAPTURE DEVICE LOGIN (TENANT DB)
      // =============================
      const TenantDeviceLogin = require("../../models/DeviceLogin")(tenantSequelize);
      const deviceDetails = captureDeviceDetails(req);
      const deviceToken = generateDeviceToken();
      const now = new Date();

      try {
        await TenantDeviceLogin.create({
          user_id: user.id,
          userCode: userCodeValue,
          device_name: deviceDetails.device_name,
          device_type: deviceDetails.device_type,
          browser_name: deviceDetails.browser_name,
          browser_version: deviceDetails.browser_version,
          os_name: deviceDetails.os_name,
          os_version: deviceDetails.os_version,
          ip_address: deviceDetails.ip_address,
          user_agent: deviceDetails.user_agent,
          device_token: deviceToken,
          last_login_at: now,
          last_activity_at: now,
          login_count: 1,
          is_active: true
        });
        console.log(`✅ Device login tracked for tenant user: ${user.email}`);
      } catch (deviceError) {
        console.warn(`⚠️  Device tracking failed for tenant user:`, deviceError.message);
        // Don't fail login if device tracking fails
      }

      // =============================
      // ✅ ALSO TRACK IN MAIN DB (cross-reference)
      // =============================
      try {
        await db.device_login.create({
          userCode: userCodeValue,
          device_name: deviceDetails.device_name,
          device_type: deviceDetails.device_type,
          browser_name: deviceDetails.browser_name,
          browser_version: deviceDetails.browser_version,
          os_name: deviceDetails.os_name,
          os_version: deviceDetails.os_version,
          ip_address: deviceDetails.ip_address,
          user_agent: deviceDetails.user_agent,
          device_token: deviceToken,
          last_login_at: now,
          last_activity_at: now,
          login_count: 1,
          is_active: true
        });
        console.log(`✅ Device login tracked in main DB for tenant user: ${user.email}`);
      } catch (mainDeviceError) {
        console.warn(`⚠️  Device tracking in main DB failed:`, mainDeviceError.message);
      }

      // =========================
      // 🔐 GENERATE ACCESS & REFRESH TOKENS
      // =========================
      const tokens = generateTokens(userCodeValue, workspace_id, role, email,tenant_db);

      // await tenantSequelize.close();

      return res.status(200).json({
        message: "Login successful",
        tokens,
        database,
        workspace: {
          workspace_id: workspace.workspace_id,
          name: workspace.name,
          slug: workspace.slug,
          workspace_type: workspace.workspace_type,
          owner_id: workspace.owner_id
        },
        user: {
          id: user.id,
          email,
          role,
          role_id,
          name,
          userCode: userCodeValue,
          isSuperAdmin: false,
          isTeamMember
        }
      });

    } catch (err) {
      console.log("Tenant DB error:", err.message);
      return res.status(500).json({
        message: "Error connecting to tenant DB"
      });
    }

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    let { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    email = email.toLowerCase();

    let user = null;
    let tenantSequelize = null;
    let dbMapping = null;

    // =========================
    // 🔹 STEP 1: CHECK SUPER ADMIN
    // =========================
    user = await db.super_admins.findOne({
      where: { email, status: true }
    });

    // =========================
    // 🔹 STEP 2: TENANT FLOW
    // =========================
    if (!user) {
       dbMapping = await db.database_mappings.findOne({
        where: {
          status: true,
          [Op.or]: [
            { email },
            Sequelize.literal(`
              EXISTS (
                SELECT 1 FROM jsonb_array_elements(users) AS u
                WHERE LOWER(u->>'email') = '${email}'
              )
            `)
          ]
        }
      });

      if (dbMapping) {
        tenantSequelize = await getTenantConnection(dbMapping);

        let TenantUser;

        if (!tenantSequelize.models.user_account) {
          TenantUser = require("../../models/userAccount")(tenantSequelize);
        } else {
          TenantUser = tenantSequelize.models.user_account;
        }

        user = await TenantUser.findOne({
          where: {
            email,
            status: "active"
          }
        });
      }
    }

    // =========================
    // 🔐 DO NOT REVEAL USER EXISTENCE
    // =========================
    if (!user) {
      return res.status(200).json({
        message: "If the email exists, a reset link has been sent"
      });
    }

    // =========================
    // 🔐 GENERATE TOKEN
    // =========================
    const rawToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = expiry;

    await user.save();

    // =========================
    // 🔗 RESET LINK (NO EMAIL)
    // =========================
    const BASE_URL = env.FRONTEND_URL || "http://localhost:5256";

    const resetLink = `${BASE_URL}/reset-password?token=${rawToken}&tenant=${dbMapping?.database || "MAIN_DB"}`;

    console.log("Reset Link:", resetLink);

    // if (tenantSequelize) await tenantSequelize.close();

    return res.status(200).json({
      message: "If the email exists, a reset link has been sent",
      // remove below in production
      resetLink
    });

  } catch (err) {
    console.error("Forgot Password Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const resetPassword = async (req, res) => {
  try {
    let { token, newPassword, tenant_db } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        message: "Token and new password are required"
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters"
      });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    let user = null;
    let tenantSequelize = null;

    // =========================
    // 🔹 STEP 1: CHECK SUPER ADMIN
    // =========================
    user = await db.super_admins.findOne({
      where: {
        status: true,
        resetPasswordToken: hashedToken,
        resetPasswordExpires: {
          [Op.gt]: new Date()
        }
      }
    });

    // =========================
    // 🔹 STEP 2: DIRECT TENANT LOOKUP (NO LOOP)
    // =========================
    if (!user) {

      if (!tenant_db) {
        return res.status(400).json({
          message: "Tenant information is required"
        });
      }

      // ✅ Fetch only ONE tenant mapping
      const dbMapping = await db.database_mappings.findOne({
        where: {
          database: tenant_db,
          status: true
        }
      });

      if (!dbMapping) {
        return res.status(400).json({
          message: "Invalid tenant"
        });
      }

      // ✅ Get pooled connection
      tenantSequelize = await getTenantConnection(dbMapping);

      let TenantUser;

      if (!tenantSequelize.models.user_account) {
        TenantUser = require("../../models/userAccount")(tenantSequelize);
      } else {
        TenantUser = tenantSequelize.models.user_account;
      }

      // ✅ Direct query (no loop)
      user = await TenantUser.findOne({
        where: {
          status: "active",
          resetPasswordToken: hashedToken,
          resetPasswordExpires: {
            [Op.gt]: new Date()
          }
        }
      });
    }

    // =========================
    // ❌ INVALID TOKEN
    // =========================
    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token"
      });
    }

    // =========================
    // 🔐 UPDATE PASSWORD
    // =========================
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    return res.status(200).json({
      message: "Password reset successful"
    });

  } catch (err) {
    console.error("Reset Password Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }
    const payload = verifyRefreshToken(refreshToken);
    const { userCode, workspace_id, role, email } = payload;

    // Check if user is a super admin in the main database
    let isSuperAdmin = false;
    const superAdmin = await db.super_admins.findOne({ where: { superAdminCode: userCode } });
    if (superAdmin) {
      isSuperAdmin = true;
      const tokens = generateTokens(userCode, workspace_id, role, email);
      return res.status(200).json({
        message: "Token refreshed successfully",
        tokens,
        isSuperAdmin: true
      });
    }

    // If not a super admin in main DB, check regular user flow
    const user = await db.user_account.findOne({ where: { userCode } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const workspace = await db.Workspace.findOne({ where: { workspace_id } });
    // if (!workspace) {
    //   return res.status(404).json({ message: "Workspace not found" });
    // }

    // Check if user exists in the tenant database
    let tenantUser = null;
    let isTenantSuperAdmin = false;

    try {
      const tenantDbConnection = await getTenantDB(userCode);

      if (tenantDbConnection && tenantDbConnection.type === "TENANT") {
        const tenantModels = await initTenantDB(tenantDbConnection.sequelize);

        // Check if user is super admin in tenant DB
        tenantUser = await tenantModels.user_account.findOne({
          where: { userCode },
          attributes: ['userCode', 'email', 'full_name', 'id']
        });

        if (tenantUser && tenantModels.roles) {
          const userRole = await tenantModels.roles.findOne({
            where: { role_id: tenantUser.role_id },
            attributes: ['role_name']
          });

          if (userRole && userRole.role_name === 'SUPER_ADMIN') {
            isTenantSuperAdmin = true;
          }
        }
      }
    } catch (tenantError) {
      console.error("Error checking tenant database:", tenantError.message);
      // Continue with regular flow if tenant DB check fails
    }

    // If user is super admin in tenant DB or regular team member
    if (isTenantSuperAdmin) {
      const tokens = generateTokens(userCode, workspace_id, role, email);
      return res.status(200).json({
        message: "Token refreshed successfully",
        tokens,
        isTenantSuperAdmin: true,
        workspace: {
          workspace_id: workspace.workspace_id,
          name: workspace.name,
          slug: workspace.slug,
          workspace_type: workspace.workspace_type,
          owner_id: workspace.owner_id
        },
        user: {
          id: tenantUser.id || user.id,
          email: tenantUser.email || email,
          role,
          name: tenantUser.full_name || user.full_name,
          userCode,
          isSuperAdmin: true
        }
      });
    }

    // Check if user is a team member in workspace
    const teamMember = await db.TeamMember.findOne({
      where: {
        user_id: userCode,
        workspace_id
      }
    });

    const tokens = generateTokens(userCode, workspace_id, role, email);
    return res.status(200).json({
      message: "Token refreshed successfully",
      tokens,
      workspace: {
        workspace_id: workspace?.workspace_id,
        name: workspace?.name,
        slug: workspace?.slug,
        workspace_type: workspace?.workspace_type,
        owner_id: workspace?.owner_id
      },
      user: {
        id: user.id,
        email,
        role,
        name: user.full_name,
        userCode,
        isTeamMember: !!teamMember
      }
    });
  } catch (error) {
    console.error("Refresh Token Error:", error);
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }
    const payload = verifyRefreshToken(refreshToken);
    const { userCode } = payload;
    await db.RefreshToken.destroy({ where: { token: refreshToken, userCode } });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAllWorkspacesForSuperAdmin = async (req, res) => {
  try {
    // Get all workspaces from main DB (no includes - no associations defined)
    const workspaces = await db.Workspace.findAll({
      attributes: ['workspace_id', 'name', 'slug', 'workspace_type', 'owner_id', 'created_at', 'status']
    });

    // Enrich workspaces with owner and tenant data counts
    const enrichedWorkspaces = await Promise.all(
      workspaces.map(async (workspace) => {
        const plainWorkspace = workspace.get({ plain: true });

        // Initialize with null counts in case of errors
        plainWorkspace.team_members_count = 0;
        plainWorkspace.brands_count = 0;
        plainWorkspace.storage_usage = null;
        plainWorkspace.database_mappings = null;
        plainWorkspace.owner = null;

        try {
          // Get owner details using owner_id
          if (plainWorkspace.owner_id) {
            const owner = await db.user_account.findOne({
              where: { userCode: plainWorkspace.owner_id },
              attributes: ['email', 'full_name', 'userCode', 'subscription_plan']
            });
            if (owner) {
              plainWorkspace.owner = owner.get({ plain: true });
            }
          }

          // Get database mapping for this workspace based on owner_id
          const mapping = await db.database_mappings.findOne({
            where: { userCode: plainWorkspace.owner_id },
            attributes: ['database', 'email', 'userCode']
          });

          if (!mapping) {
            return plainWorkspace;
          }

          plainWorkspace.database_mappings = mapping.get({ plain: true });

          // Get tenant database connection
          const tenantDbData = await getTenantDB(mapping.userCode);

          if (!tenantDbData || tenantDbData.type === 'MAIN') {
            return plainWorkspace;
          }

          // Initialize tenant models
          const tenantModels = await initTenantDB(tenantDbData.sequelize);

          // Get counts from tenant database
          const workspace_id = plainWorkspace.workspace_id;

          // Count team members for this workspace
          if (tenantModels.TeamMember) {
            plainWorkspace.team_members_count = await tenantModels.TeamMember.count({
              where: { workspace_id }
            });
          }

          // Count brands for this workspace
          if (tenantModels.Brand) {
            plainWorkspace.brands_count = await tenantModels.Brand.count({
              where: { workspace_id }
            });
          }

          // Get storage usage for this workspace
          if (tenantModels.StorageUsage) {
            const storageData = await tenantModels.StorageUsage.findOne({
              where: { workspace_id },
              attributes: ['total_bytes', 'limit_bytes', 'file_count']
            });
            if (storageData) {
              plainWorkspace.storage_usage = storageData.get({ plain: true });
            }
          }

          // Close the tenant connection after use
          if (tenantDbData.sequelize) {
            await tenantDbData.sequelize.close();
          }

        } catch (error) {
          console.error(`Error fetching tenant data for workspace ${plainWorkspace.workspace_id}:`, error);
          // Continue with null counts for this workspace
        }

        return plainWorkspace;
      })
    );

    return res.status(200).json({
      message: "Workspaces retrieved successfully",
      workspaces: enrichedWorkspaces
    });
  } catch (error) {
    console.error("Get Workspaces Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateWorkspaceDetailsForAdminAndSuperAdmin = async (tenantModels, workspaceId, newDetails) => {
  try {
    const workspace = await tenantModels.Workspace.findOne({
      where: { workspace_id: workspaceId }
    });
    const contentupdate = {};
    if (newDetails.name) {
      contentupdate.name = newDetails.name;
    }
    if (newDetails.slug) {
      contentupdate.slug = newDetails.slug;
    }
    if (newDetails.workspace_type) {
      contentupdate.workspace_type = newDetails.workspace_type;
    }
    if (Object.keys(contentupdate).length === 0) {
      return;
    }
    await workspace.update(contentupdate);
    console.log(`✅ Updated workspace details for workspace ID: ${workspaceId}`);
  } catch (error) {
    console.error(`❌ Error updating workspace details for workspace ID ${workspaceId}:`, error.message);
    throw error;
  }
};

const updateWorkspaceDetails = async (req, res) => {
  try {
    const { workspace_id: requestWorkspaceId } = req.body;
    const { name, slug, workspace_type } = req.body;
    const userRole = req.user.role;
    const userCodeFromToken = req.user.userCode;

    // Validate input
    if (!name && !slug && !workspace_type) {
      return res.status(400).json({
        message: "At least one field (name, slug, workspace_type) is required to update"
      });
    }

    let workspaceId;

    // ==========================================
    // 🔹 DETERMINE WORKSPACE ID
    // ==========================================
    if (userRole === "SUPER_ADMIN") {
      // Super admin must provide workspace_id
      if (!requestWorkspaceId) {
        return res.status(400).json({
          message: "workspace_id is required for super admin"
        });
      }
      workspaceId = requestWorkspaceId;
    } else {
      // Tenant users use their workspace_id from token
      if (!req.user.workspace_id) {
        return res.status(403).json({
          message: "Workspace information not found in token"
        });
      }
      workspaceId = req.user.workspace_id;
    }

    // ==========================================
    // 🔹 GET TENANT DB CONNECTION
    // ==========================================
    const tenantDbData = await getTenantDB(userCodeFromToken);

    if (!tenantDbData || tenantDbData.type === 'MAIN') {
      return res.status(400).json({
        message: "Unable to connect to tenant database"
      });
    }

    // Initialize tenant models
    const tenantModels = await initTenantDB(tenantDbData.sequelize);

    // ==========================================
    // 🔹 VALIDATE WORKSPACE EXISTS
    // ==========================================
    const workspace = await tenantModels.Workspace.findOne({
      where: { workspace_id: workspaceId }
    });

    if (!workspace) {
      // Close connection before error response
      if (tenantDbData.sequelize) {
        await tenantDbData.sequelize.close();
      }
      return res.status(404).json({
        message: "Workspace not found"
      });
    }

    // ==========================================
    // 🔹 UPDATE WORKSPACE
    // ==========================================
    const updateDetails = {};
    if (name) updateDetails.name = name;
    if (slug) updateDetails.slug = slug;
    if (workspace_type) updateDetails.workspace_type = workspace_type;

    await updateWorkspaceDetailsForAdminAndSuperAdmin(tenantModels, workspaceId, updateDetails);

    // Fetch updated workspace
    const updatedWorkspace = await tenantModels.Workspace.findOne({
      where: { workspace_id: workspaceId },
      attributes: ['workspace_id', 'name', 'slug', 'workspace_type', 'owner_id', 'created_at', 'status']
    });

    // Close connection
    if (tenantDbData.sequelize) {
      await tenantDbData.sequelize.close();
    }

    return res.status(200).json({
      message: "Workspace updated successfully",
      workspace: updatedWorkspace.get({ plain: true })
    });

  } catch (error) {
    console.error("Update Workspace Details Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  tokencheck,
  superAdminCreate,
  UserSignup,
  updateSuperAdmin,
  deleteSuperAdmin,
  unifiedLogin,
  forgotPassword,
  resetPassword,
  refreshToken,
  logout,
  getAllWorkspacesForSuperAdmin,
  updateWorkspaceDetails
}
