const moment = require("moment");
const winston = require("winston");
require("winston-daily-rotate-file");

// ==============================
// 🔹 Create Logger (Singleton)
// ==============================
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),

  transports: [
    new winston.transports.DailyRotateFile({
      filename: "tfs_ERROR_LOG_%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxSize: "1g",
      maxFiles: "365d",
      dirname: "logs/errorLogs",
    }),

    // ✅ Console logging for dev
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});


// ==============================
// 🔹 Create Log
// ==============================
const createLog = (fname, message, req = {}) => {
  try {
    const logMessage = {
      time: moment().format("DD-MM-YYYY hh:mm:ss a"),
      file: fname,
      errorMessage: message,

      method: req?.method,
      endpoint: req?.originalUrl,

      headers: req?.headers,
      params: req?.params,
      body: req?.body,
      query: req?.query,
    };

    logger.error(logMessage);

  } catch (error) {
    console.error("❌ Logger Error:", error.message);
  }
};


// ==============================
// 🔹 Response Helpers
// ==============================
const error = (res, message, code = 400) => {
  return res.status(code).json({
    status: false,
    errorMessage: message,
  });
};

const success = (res, message, data = null) => {
  const response = {
    status: true,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(200).json(response);
};


// ==============================
// Export
// ==============================
module.exports = {
  logger,
  createLog,
  error,
  success,
};