const { Sequelize } = require("sequelize");

const tenantConnections = {};

const getTenantConnection = async (mapping) => {
  const key = `${mapping.database}_${mapping.db_host}_${mapping.db_port}`;

  // ✅ Reuse existing connection
  if (tenantConnections[key]) {
    return tenantConnections[key];
  }

  // ✅ Create new connection with pooling
  const sequelize = new Sequelize(
    mapping.database,
    mapping.db_username,
    mapping.db_password,
    {
      host: mapping.db_host,
      port: mapping.db_port,
      dialect: "postgres",
      logging: false,

      pool: {
        max: 10,
        min: 2,
        acquire: 30000,
        idle: 10000,
      },
    }
  );

  try {
    await sequelize.authenticate();
    console.log(`✅ Connected to Tenant DB: ${mapping.database}`);
  } catch (err) {
    console.error(`❌ Failed DB: ${mapping.database}`, err.message);
    throw err;
  }

  tenantConnections[key] = sequelize;

  return sequelize;
};

module.exports = {
  getTenantConnection,
};