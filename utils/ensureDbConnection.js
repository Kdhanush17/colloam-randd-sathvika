let isConnected = false;

const ensureDbConnection = async (sequelize, res, label = "Database") => {
  if (!sequelize) {
    res.status(500).json({
      message: `${label} connection not initialized.`,
    });
    return false;
  }

  if (isConnected) return true;

  try {
    await sequelize.authenticate();
    isConnected = true;
    return true;
  } catch (error) {
    console.error(`${label} connection error:`, error.message);

    res.status(500).json({
      message: `${label} connection failed.`,
    });

    return false;
  }
};

module.exports = ensureDbConnection;