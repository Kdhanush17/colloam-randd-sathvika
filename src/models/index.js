const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
const fs = require('fs');
const basename = path.basename(__filename);
const env = require('../../config/environment');

const db = {};


// 🔹 Default DB Connection (main DB)
const sequelize = new Sequelize(
  env.dbName,
  env.dbUserName,
  env.dbPassword,
  {
    host: env.host,
    dialect: env.dialect,
    logging: false,

    // ⚠️ deprecated but kept as you used
    operatorsAliases: false,

    pool: {
      max: env.pool?.max || 5,
      min: env.pool?.min || 0,
      acquire: env.pool?.acquire || 30000,
      idle: env.pool?.idle || 10000
    }
  }
);

// 🔹 CONNECT + SYNC
sequelize.authenticate()
  .then(async () => {
    console.log('✅ Connected to PostgreSQL');

    // 🔥 CREATE TABLES
    await sequelize.sync({ alter: true });
    console.log('✅ All models synced successfully');
  })
  .catch((err) => {
    console.error('❌ PostgreSQL connection error:', err);
    process.exit(1);
  });

db.sequelize = sequelize;
db.Sequelize = Sequelize;


// 🔹 Root connection (super admin)
const getRootSequelize = () => {
  return new Sequelize(
    'postgres',
    env.superAdminDB.username,
    env.superAdminDB.dbPassword,
    {
      host: env.superAdminDB.url,
      dialect: 'postgres',
      logging: false,
    }
  );
};


// 🔹 Create Tenant DB + User
const createTenant = async (dbName, adminEmail, adminPassword) => {
  const username = adminEmail.replace(/[@.]/g, '_');
  const rootSequelize = getRootSequelize();

  try {
    await rootSequelize.authenticate();

    await rootSequelize.query(`CREATE DATABASE "${dbName}"`);
    console.log(`✅ Database ${dbName} created`);

    await rootSequelize.query(`
      CREATE USER "${username}" WITH PASSWORD '${adminPassword}'
    `);

    await rootSequelize.query(`
      GRANT ALL PRIVILEGES ON DATABASE "${dbName}" TO "${username}"
    `);
    return { username };

  } catch (err) {
    console.error('❌ Error creating tenant:', err.message);
    throw err;
  } finally {
    await rootSequelize.close();
  }
};


// 🔹 Delete Tenant User
const deleteTenantUser = async (username) => {
  const rootSequelize = getRootSequelize();

  try {
    await rootSequelize.authenticate();

    await rootSequelize.query(`DROP USER IF EXISTS "${username}"`);
    console.log(`🧹 Deleted user ${username}`);

  } catch (err) {
    console.error('❌ Error deleting user:', err.message);
  } finally {
    await rootSequelize.close();
  }
};


// 🔹 Drop Tenant Database
const deleteTenantDatabase = async (dbName) => {
  const rootSequelize = getRootSequelize();

  try {
    await rootSequelize.authenticate();

    await rootSequelize.query(`DROP DATABASE IF EXISTS "${dbName}"`);
    console.log(`🧹 Dropped DB ${dbName}`);

  } catch (err) {
    console.error(`❌ Error dropping DB ${dbName}:`, err.message);
  } finally {
    await rootSequelize.close();
  }
};


// 🔹 Auto-load Sequelize models
fs.readdirSync(__dirname)
  .filter((file) => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes); // ✅ FIXED
    db[model.name] = model;
  });

// 🔹 Apply associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});


module.exports = {
  ...db,
  sequelize,
  createTenant,
  deleteTenantUser,
  deleteTenantDatabase
};