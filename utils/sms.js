const axios = require("axios");
const env = require("../config/environment");

// 🔐 Move secrets to env
const AUTH_KEY = env.SMS_AUTH_KEY;
const SENDER_ID = env.SMS_SENDER_ID;
const TEMPLATE_ID = env.SMS_TEMPLATE_ID;
const BASE_URL = "http://shubhsms.com/apiv2";


// ==============================
// 🔹 Send SMS
// ==============================
const sendSMS = async (phoneNumber, message) => {
  try {
    if (!phoneNumber || !message) {
      throw new Error("Phone number and message are required");
    }

    // ✅ Encode message to avoid URL issues
    const encodedMessage = encodeURIComponent(message);

    const url = `${BASE_URL}?authkey=${AUTH_KEY}&senderid=${SENDER_ID}&numbers=${phoneNumber}&message=${encodedMessage}&route=4&template_id=${TEMPLATE_ID}`;

    const response = await axios.get(url, {
      timeout: 10000, // ⏱ timeout protection
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    console.log("✅ SMS Sent:", {
      phoneNumber,
      status: response.data
    });

    return response.data;

  } catch (error) {
    console.error("❌ SMS Error:", {
      phoneNumber,
      error: error.response?.data || error.message
    });

    throw error;
  }
};


module.exports = { sendSMS };