const db = require("../../models/index");
const logger = require('../../../utils/winston');


// ==============================
// ✅ GET SETTINGS
// ==============================
const getSettings = async (req, res) => {
  try {
    const { module } = req.query;

    if (!module) {
      return logger.error(res, "Module is required", 400);
    }

    const status = module.toUpperCase();

    const settings = await db.system_settings.findAll({
      where: { module: status },
      attributes: ["module", "key", "value"]
    });

    if (settings.length > 0) {
      return logger.success(res, "Settings retrieved successfully", settings);
    }

    return logger.success(res, "Data not found", []);

  } catch (error) {
    logger.createLog(__filename, error.message, req);
    return logger.error(res, "Exception in get Settings");
  }
};


// ==============================
// ✅ UPDATE SETTINGS
// ==============================
const updateSettings = async (req, res) => {
  try {
    const { module, data } = req.body;

    if (!module || !Array.isArray(data)) {
      return logger.error(res, "Invalid payload", 400);
    }

    const moduleName = module.toUpperCase();

    // 🔥 Bulk update (faster than loop)
    await Promise.all(
      data.map(setting =>
        db.system_settings.update(
          { value: setting.value },
          {
            where: {
              module: moduleName,
              key: setting.key
            }
          }
        )
      )
    );

    return logger.success(res, "Settings updated successfully");

  } catch (error) {
    logger.createLog(__filename, error.message, req);
    return logger.error(res, "Exception in update settings");
  }
};


// ==============================
// ✅ CREATE SETTINGS
// ==============================
const createSystemSetting = async (req, res) => {
  try {
    const { module, data } = req.body;

    if (!module || !Array.isArray(data) || data.length === 0) {
      return logger.error(res, "Module and data array required", 400);
    }

    const moduleName = module.toUpperCase();

    const settingsToInsert = data.map(item => ({
      module: moduleName,
      key: item.key,
      value: item.value
    }));

    const savedSettings = await db.system_settings.bulkCreate(settingsToInsert);

    return logger.success(res, "System settings created successfully", savedSettings);

  } catch (error) {
    logger.createLog(__filename, error.message, req);
    return logger.error(res, "Exception in create settings");
  }
};


module.exports = {
  getSettings,
  updateSettings,
  createSystemSetting
};