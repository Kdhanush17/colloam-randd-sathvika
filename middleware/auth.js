const jwt = require('jsonwebtoken');
const env = require('../config/environment');

// 🔹 Helpers
const status = require('../helpers/statusHelper');
const logger = require('../utils/winston');

// 🔹 Sequelize DB
const db = require('../src/models');

// 🔹 Sequelize Operators (if needed)
    const { Op, Sequelize } = require("sequelize");
const {getTenantDB} = require("../utils/socketUtilities")
// Middleware for user authentication

const userAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // ==============================
    // ✅ CHECK TOKEN
    // ==============================
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized - Token missing"
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized - Invalid token format"
      });
    }

    // ==============================
    // ✅ VERIFY TOKEN
    // ==============================
    let decoded;
    try {
      decoded = jwt.verify(token, env.jwtKey);
    } catch (err) {
      return res.status(401).json({
        status: false,
        message: "Invalid or expired token"
      });
    }

    // ==============================
    // ✅ FETCH USER (POSTGRES)
    // ==============================
    const userId = decoded.userdata?.id;

    if (!userId) {
      return res.status(401).json({
        status: false,
        message: "Invalid token payload"
      });
    }

    const userdata = await db.user_account.findByPk(userId);

    if (!userdata || userdata.status !== true) {
      return res.status(401).json({
        status: false,
        message: "User not found or inactive"
      });
    }

    // ==============================
    // ✅ ATTACH USER
    // ==============================
    req.user = {
      id: userdata.id,
      email: userdata.email,
      role_id: userdata.role_id,
      role_name: userdata.role_name
    };

    next();

  } catch (error) {
    logger.createLog(__filename, error.message, req);
    return res.status(500).json({
      status: false,
      message: "Internal server error"
    });
  }
};

// Middleware for jobseeker authentication

const jobseekerAuth = async (req, res, next) => {
  if (req.headers.authorization !== undefined) {
    let jwttoken = req.headers.authorization.split(" ");
    if (typeof jwttoken[1] !== 'undefined') {
      jwt.verify(jwttoken[1], env.jwtKey, async (err, user) => {
        if (err) {
          return res.status(401).send(status.tokenError);
        }

        try {

          let isJobseeker = await Jobseeker.findOne({
            _id: user.id,   // USE .id instead of ._id
            status: true
          });

          if (isJobseeker) {
            req.Jobseeker = {
              JobseekerId: isJobseeker._id,
              email: isJobseeker.email,
              mobile_number: isJobseeker.mobile_number,
              role_name: isJobseeker.role_name
            };
            next();
          } else {
            return res.status(401).send(status.tokenError);
          }
        } catch (err) {
          return res.status(500).send(status.serverError);
        }
      });
    } else {
      return res.status(401).send(status.tokenError);
    }
  } else {
    return res.status(401).send(status.tokenError);
  }
};

const unifiedAuthMiddleware = async (req, res, next) => {
  try {
    console.log("========== AUTH MIDDLEWARE ==========");

    const authHeader = req.headers.authorization;

    // ================= TOKEN CHECK =================
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authorization token missing"
      });
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, env.jwtKey);
    } catch (err) {
      return res.status(401).json({
        message:
          err.name === "TokenExpiredError"
            ? "Token expired"
            : "Invalid token"
      });
    }

    const { email, userCode, workspace_id, role } = decoded;

    console.log("Decoded userCode:", userCode, "| Role:", role, "| Workspace:", workspace_id);

    // =============================
    // 🔹 1. SUPER ADMIN (MAIN DB ONLY)
    // =========================
    const superAdmin = await db.super_admins.findOne({
      where: { superAdminCode: userCode }
    });

    if (superAdmin) {
      console.log("👑 SUPER ADMIN LOGIN");

      req.user = {
        id: superAdmin.id,
        userCode: superAdmin.superAdminCode,
        email: superAdmin.email,
        role_id: superAdmin.role_id,
        role: "SUPER_ADMIN",
        type: "SUPER_ADMIN",
        db: "MAIN"
      };

      return next();
    }

    // =============================
    // 🔥 2. GET TENANT DB FOR TENANT USERS
    // =============================
    let sequelize = null;
    let mapping = null;
    let isTenant = false;

    if (workspace_id) {
      const tenantResult = await getTenantDB(userCode);

      if (tenantResult && tenantResult.type === "TENANT") {
        console.log("✅ USING TENANT DB:", tenantResult.mapping?.database);

        sequelize = tenantResult.sequelize;
        mapping = tenantResult.mapping;
        req.tenantDB = sequelize;
        isTenant = true;
      }
    }

    // =========================
    // 🔹 3. TENANT USERS (ADMIN, EDITOR, SEO_MANAGER, etc.)
    // =========================
    if (isTenant && workspace_id) {
      console.log("🔎 Checking TENANT USER for role:", role);

      const TenantUser = require("../src/models/userAccount")(sequelize);

      const user = await TenantUser.findOne({
        where: { userCode }
      });

      if (user) {
        console.log("✅ TENANT USER FOUND - Role:", user.role_name || role);

        req.user = {
          id: user.id,
          userCode: user.userCode,
          email: user.email,
          role_id: user.role_id,
          role: user.role_name || role || "viewer",
          type: role || user.role_name,
          workspace_id: workspace_id,
          tenant_id: mapping?.tenant_id,
          database: mapping?.database,
          db: "TENANT"
        };

        return next();
      }
    }

    // =========================
    // ❌ NOT FOUND
    // =========================
    console.log("❌ USER NOT FOUND");

    return res.status(404).json({
      message: "User not found"
    });

  } catch (error) {
    console.error("❌ Auth Middleware Error:", error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

const system_user_auth = (permissionKey) => {
  return async (req, res, next) => {
    try {
      const role_id = req.userDetails?.role_id;

      if (!role_id) {
        return res.status(403).json({
          status: false,
          message: "Invalid role"
        });
      }

      // ==============================
      // ✅ SINGLE QUERY (OPTIMIZED)
      // ==============================
      const permissionData = await db.SystemUserPermission.findOne({
        where: { role_id },
        include: [
          {
            model: db.Permission,
            attributes: [],
            where: {
              key: permissionKey,
              status: true
            }
          }
        ]
      });

      if (!permissionData) {
        return res.status(403).json({
          status: false,
          message: "Access denied"
        });
      }

      // ✅ Authorized
      next();

    } catch (error) {
      logger.createLog(__filename, error.message, req);

      return res.status(500).json({
        status: false,
        message: "Permission check failed"
      });
    }
  };
};


const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // ==============================
    // ✅ CHECK HEADER
    // ==============================
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: false,
        message: "Authentication token is missing"
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        status: false,
        message: "Invalid token format"
      });
    }

    // ==============================
    // ✅ VERIFY TOKEN
    // ==============================
    let decoded;
    try {
      decoded = jwt.verify(token, env.jwtKey);
    } catch (err) {
      return res.status(401).json({
        status: false,
        message: "Invalid or expired token"
      });
    }

    // ==============================
    // ✅ OPTIONAL DB VALIDATION (RECOMMENDED)
    // ==============================
    const userId = decoded?.id || decoded?.userdata?.id;

    if (!userId) {
      return res.status(401).json({
        status: false,
        message: "Invalid token payload"
      });
    }

    const user = await db.user_account.findByPk(userId);

    if (!user || user.status !== true) {
      return res.status(401).json({
        status: false,
        message: "User not found or inactive"
      });
    }

    // ==============================
    // ✅ ATTACH USER
    // ==============================
    req.user = {
      id: user.id,
      email: user.email,
      role_id: user.role_id,
      role_name: user.role_name
    };

    next();

  } catch (error) {
    logger.createLog(__filename, error.message, req);

    return res.status(500).json({
      status: false,
      message: "Internal server error"
    });
  }
};

module.exports = {
  userAuth,
  authenticateUser,
  system_user_auth,
  unifiedAuthMiddleware,
  jobseekerAuth
};
