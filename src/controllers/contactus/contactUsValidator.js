const statusHelper = require("../../../helpers/statusHelper");
const logger = require('../../../utils/winston');

const contactFormValidation = async (req, res, next) => {
  try {
    let { name, email, phoneno, subject, message } = req.body;

    // 🔹 Trim inputs
    name = name?.trim();
    email = email?.trim();
    phoneno = phoneno?.trim();
    subject = subject?.trim();
    message = message?.trim();

    // ==============================
    // ✅ Required Fields
    // ==============================
    if (!name) return statusHelper.validationError(res, "Name is required");
    if (!email) return statusHelper.validationError(res, "Email is required");
    if (!phoneno) return statusHelper.validationError(res, "Phone number is required");
    if (!subject) return statusHelper.validationError(res, "Subject is required");
    if (!message) return statusHelper.validationError(res, "Message is required");

    // ==============================
    // ✅ Name Validation
    // ==============================
    if (/\s{2,}/.test(name)) {
      return statusHelper.validationError(res, "Name should not contain multiple spaces");
    }

    const nameRegex = /^[a-zA-Z ]{3,50}$/;
    if (!nameRegex.test(name)) {
      return statusHelper.validationError(
        res,
        "Name must be 3–50 characters, only letters and spaces"
      );
    }

    // ==============================
    // ✅ Phone Validation
    // ==============================
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneno)) {
      return statusHelper.validationError(
        res,
        "Phone number must be exactly 10 digits"
      );
    }

    // ==============================
    // ✅ Email Validation
    // ==============================
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return statusHelper.validationError(res, "Invalid email address");
    }

    // ==============================
    // ✅ Subject Validation
    // ==============================
    const subjectRegex = /^[a-zA-Z0-9.,'"()\- ]{3,100}$/;
    if (!subjectRegex.test(subject)) {
      return statusHelper.validationError(
        res,
        "Subject must be 3–100 characters"
      );
    }

    // ==============================
    // ✅ Message Validation
    // ==============================
    if (message.length < 5 || message.length > 1000) {
      return statusHelper.validationError(
        res,
        "Message must be between 5 and 1000 characters"
      );
    }

    // 🔹 Attach sanitized values back
    req.body = { name, email, phoneno, subject, message };

    next();

  } catch (error) {
    logger.createLog(__filename, error.message, req);
    return logger.error(res, "Exception in contact validation");
  }
};

module.exports = {
  contactFormValidation,
};