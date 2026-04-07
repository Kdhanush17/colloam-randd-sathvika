const logger = require('../../../utils/winston');

const REQUIRED_S3_FIELDS = [
  "accessKeyId",
  "secretAccessKey",
  "region",
  "bucketname"
];

const updateSettings = async (req, res, next) => {
  try {
    const { module, data } = req.body;

    // ✅ Basic validation
    if (!module || !Array.isArray(data) || data.length === 0) {
      return logger.error(res, "Module and data array are required", 400);
    }

    // 🔹 Normalize module
    const moduleName = module.toUpperCase();

    // 🔹 Convert array → object for easy lookup
    const settingsMap = {};
    for (const item of data) {
      if (!item.key) {
        return logger.error(res, "Each setting must have a key", 400);
      }

      settingsMap[item.key] = item.value;
    }

    // ==============================
    // ✅ Module-specific validation
    // ==============================
    if (moduleName === "S3") {
      const missingFields = REQUIRED_S3_FIELDS.filter(
        (field) => !settingsMap[field] || !String(settingsMap[field]).trim()
      );

      if (missingFields.length > 0) {
        return logger.error(
          res,
          `Missing required S3 fields: ${missingFields.join(", ")}`,
          400
        );
      }
    }

    // 🔥 Generic validation (no empty values)
    const invalidField = data.find(
      (item) => item.value === undefined || item.value === null
    );

    if (invalidField) {
      return logger.error(
        res,
        `Value missing for key: ${invalidField.key}`,
        400
      );
    }

    // ✅ Passed validation
    next();

  } catch (error) {
    logger.createLog(__filename, error.message, req);
    return logger.error(res, "Exception in updateSettings validation");
  }
};

module.exports = { updateSettings };