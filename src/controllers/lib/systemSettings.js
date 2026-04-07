const { SystemSettings } = require("../../models/systemSettings");
const db = require("../../models/index");


// 🔹 Generic function (reusable)
const fetchSettings = async (moduleName) => {
  const records = await db.system_settings.findAll({
    where: { module: moduleName }
  });

  let obj = {};

  if (records.length > 0) {
    obj = records.reduce((acc, item) => {
      const data = item.dataValues || item;
      acc[data.key] = data.value;
      return acc;
    }, {});
  }

  return obj;
};


// ==============================
// ✅ S3 DETAILS
// ==============================
async function gets3details() {
  try {
    const obj = await fetchSettings("S3");

    const requiredFields = [
      "accessKeyId",
      "secretAccessKey",
      "region",
      "bucketname"
    ];

    const missingFields = requiredFields.filter(field => !obj[field]);

    if (missingFields.length > 0) {
      return {
        status: false,
        errorMessage: `Please configure S3 details for: ${missingFields.join(", ")}`
      };
    }

    return { status: true, data: obj };

  } catch (error) {
    return { status: false, errorMessage: error.message };
  }
}


// ==============================
// ✅ CASHFREE DETAILS
// ==============================
async function getcashfreedetails() {
  try {
    const obj = await fetchSettings("CASHFREE");

    const requiredKeys = [
      "TestUrl",
      "appId",
      "secretKey",
      "currency",
      "mode",
      "returnUrl",
      "notifyUrl",
      "PRODUrl",
      "paymentlanding"
    ];

    const missingKeys = requiredKeys.filter(key => !obj[key]);

    if (missingKeys.length > 0) {
      return {
        status: false,
        errorMessage: `Missing Cashfree config: ${missingKeys.join(", ")}`
      };
    }

    return { status: true, data: obj };

  } catch (error) {
    return { status: false, errorMessage: error.message };
  }
}


// ==============================
// ✅ SMTP DETAILS
// ==============================
async function getsmtpdetails() {
  try {
    const obj = await fetchSettings("SMTP");

    const requiredFields = [
      "host",
      "user",
      "pass",
      "port",
      "from",
      "hrMail"
    ];

    const missingFields = requiredFields.filter(field => !obj[field]);

    if (missingFields.length > 0) {
      return {
        status: false,
        errorMessage: `Missing SMTP config: ${missingFields.join(", ")}`
      };
    }

    return { status: true, data: obj };

  } catch (error) {
    return { status: false, errorMessage: error.message };
  }
}


module.exports = {
  gets3details,
  getcashfreedetails,
  getsmtpdetails
};