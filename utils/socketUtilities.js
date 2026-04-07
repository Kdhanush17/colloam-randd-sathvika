const LRUCache = require("lru-cache");
const { Sequelize, Op } = require("sequelize");
const db = require("../src/models");
const { DataTypes } = require("sequelize");

const fs = require("fs");
const path = require("path");
// =============================
// 🔥 CACHE SETUP
// =============================
const mappingCache = new LRUCache({
  max: 100,
  ttl: 1000 * 60 * 10,
  updateAgeOnGet: true,
});

const connectionCache = new LRUCache({
  max: 100,
  ttl: 1000 * 60 * 10,
});

// =============================
// ✅ GET DATABASE MAPPING
// =============================
const getDatabaseConnection = async (key) => {
  try {

    if (!key) return null;

    // =============================
    // 🔥 STRICT QUERY (IMPORTANT FIX)
    // =============================
    const tenant = await db.database_mappings.findOne({
      where: {
        userCode: key,
        status: true
      }
    });

    if (!tenant) return null;

    const tenantData = tenant.get({ plain: true });

    return tenantData;

  } catch (error) {
    console.error("❌ getDatabaseConnection error:", error);
    return null;
  }
};

// =============================
// ✅ GET DB INSTANCE
// =============================
const getTenantDB = async (key) => {
  try {
    const mapping = await getDatabaseConnection(key);

    // =============================
    // 🔥 TENANT DB
    // =============================
    if (mapping) {
      let sequelizeInstance = connectionCache.get(mapping.database);

      if (!sequelizeInstance) {

        sequelizeInstance = new Sequelize(
          mapping.database,
          mapping.db_username,
          mapping.db_password,
          {
            host: mapping.db_host,
            port: mapping.db_port,
            dialect: "postgres",
            logging: false,
          }
        );

        connectionCache.set(mapping.database, sequelizeInstance);
      } else {
        console.log("⚡ Using cached connection");
      }

      return {
        type: "TENANT",
        sequelize: sequelizeInstance,
        mapping
      };
    }

    return {
      type: "MAIN",
      sequelize: db.sequelize,
      mapping: null
    };

  } catch (error) {
    console.error("❌ getTenantDB error:", error);
    throw error;
  }
};


const initTenantDB = async (sequelize) => {
  try {
    // =============================
    // ✅ CONNECT DB
    // =============================
    await sequelize.authenticate();

    const models = {};

    // ✅ FIXED PATH
    const modelsPath = path.join(__dirname, "../src/models");

    if (!fs.existsSync(modelsPath)) {
      throw new Error(`Models folder not found at ${modelsPath}`);
    }

    // =============================
    // ✅ LOAD MODELS
    // =============================
    fs.readdirSync(modelsPath)
      .filter(file => file.endsWith(".js") && file !== "index.js")
      .forEach(file => {
        const model = require(path.join(modelsPath, file))(sequelize, DataTypes);
        models[model.name] = model;   // ✅ FIXED
      });

    // =============================
    // ✅ APPLY ASSOCIATIONS
    // =============================
    Object.values(models).forEach(model => {
      if (model.associate) {
        model.associate(models);
      }
    });

    // =============================
    // ✅ SYNC TABLES
    // =============================
    await sequelize.sync();

    // =============================
    // ✅ DROP PROBLEMATIC FK CONSTRAINT
    // =============================
    try {
      await sequelize.query(`
        ALTER TABLE team_members
        DROP CONSTRAINT IF EXISTS team_members_user_id_fkey;
      `);
      console.log("✅ Dropped team_members_user_id_fkey constraint");
    } catch (err) {
      console.warn("⚠️  Could not drop foreign key constraint:", err.message);
    }

    return models;

  } catch (err) {
    console.error("❌ Tenant DB init error:", err);
    throw err;
  }
};

module.exports = {
  getTenantDB,
  getDatabaseConnection,
  initTenantDB
};