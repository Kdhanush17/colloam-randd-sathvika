const db = require("../../models/index");
const { error: logError, success: logSuccess } = require("../../../utils/winston");
const nodemailer = require("nodemailer");
const { getsmtpdetails } = require("../lib/systemSettings");
const hbs = require("handlebars");
const fs = require("fs");
const path = require("path");
const { Op, Sequelize } = require("sequelize");

let transporter;

// Initialize SMTP transporter
async function initSMTP() {
  try {
    let smtpDetails = await getsmtpdetails();
    if (!smtpDetails.status) {
      throw new Error(smtpDetails.errorMessage);
    }
    smtpDetails = smtpDetails.data;
    transporter = nodemailer.createTransport({
      host: smtpDetails.host,
      port: smtpDetails.port,
      secure: smtpDetails.port == 465,
      auth: {
        user: smtpDetails.user,
        pass: smtpDetails.pass,
      }
    });
  } catch (err) {
    console.error("❌ Failed to initialize SMTP:", err.message);
    transporter = null;
  }
}

// Generate random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Check if email exists in database
async function checkEmailExists(email) {
  try {
    const normalizedEmail = email.toLowerCase();

    const dbMapping = await db.database_mappings.findOne({
      where: {
        [Op.or]: [
          { email: normalizedEmail },

          Sequelize.literal(`
            EXISTS (
              SELECT 1
              FROM jsonb_array_elements(users) AS "user"
              WHERE LOWER("user"->>'email') = '${normalizedEmail}'
            )
          `)
        ]
      }
    });

    if (dbMapping) {
      return {
        exists: true,
        source: "database_mappings",
        mapping: dbMapping
      };
    }

    return {
      exists: false,
      source: null
    };

  } catch (error) {
    console.error("❌ Error checking email:", error.message);
    throw error;
  }
}

// Send OTP email
async function sendOTPEmail(toEmail, otp, userName = "User") {
  try {
    if (!transporter) {
      await initSMTP();
    }

    if (!transporter) {
      throw new Error("SMTP transporter not initialized");
    }

    let smtpDetails = await getsmtpdetails();
    if (!smtpDetails.status) {
      throw new Error(smtpDetails.errorMessage);
    }
    smtpDetails = smtpDetails.data;

    const mailOptions = {
      from: `"${smtpDetails.sender_name}" <${smtpDetails.sender_mail}>`,
      to: toEmail,
      subject: "Email Verification - OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Email Verification</h2>
          <p>Hi ${userName},</p>
          <p>Your One-Time Password (OTP) for email verification is:</p>
          <h1 style="color: #007bff; font-size: 32px; letter-spacing: 5px; margin: 20px 0;">
            ${otp}
          </h1>
          <p>This OTP will expire in 10 minutes.</p>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            If you did not request this OTP, please ignore this email.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP sent to ${toEmail}`);
    return true;
  } catch (error) {
    console.error("❌ Failed to send OTP email:", error.message);
    throw error;
  }
}

// Send OTP to user email
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Validation
    if (!email) {
      return logError(res, "Email is required", 400);
    }

    // Check if email exists
    const emailCheck = await checkEmailExists(email);
    console.log("Email check result:", emailCheck);

    if (emailCheck.exists) {
      return logError(res, "Email is already registered in our system", 404);
    }

    // Generate OTP
    const otp = generateOTP();
    const expirationTime = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Get user name from either source
    let userName = "User";
    if (emailCheck.source === "user_account" && emailCheck.user) {
      userName = emailCheck.user.full_name || "User";
    }

    // Save OTP to database
    await db.otp.create({
      email: email.toLowerCase(),
      otp: otp,
      name: userName,
      isVerified: false
    });

    // Send OTP via email
    await sendOTPEmail(email, otp, userName);

    return logSuccess(res, "OTP sent successfully to your email", {
      email: email,
      expiresIn: "10 minutes"
    });
  } catch (error) {
    console.error("❌ Error sending OTP:", error.message);
    return logError(res, "Failed to send OTP", 500);
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validation
    if (!email || !otp) {
      return logError(res, "Email and OTP are required", 400);
    }

    // Find OTP record
    const otpRecord = await db.otp.findOne({
      where: { email: email.toLowerCase(), otp: otp.toString() },
      order: [['createdAt', 'DESC']]
    });

    if (!otpRecord) {
      return logError(res, "Invalid OTP", 401);
    }

    // Check if OTP is already verified
    if (otpRecord.isVerified) {
      return logError(res, "This OTP has already been used", 400);
    }

    // Check if OTP has expired (10 minutes)
    const currentTime = new Date();
    const createdTime = new Date(otpRecord.createdAt);
    const diffInMinutes = (currentTime - createdTime) / (1000 * 60);

    if (diffInMinutes > 10) {
      return logError(res, "OTP has expired. Please request a new one", 401);
    }

    // Mark OTP as verified
    await db.otp.update(
      { isVerified: true },
      { where: { id: otpRecord.id } }
    );

    // Update user email verification status
    await db.user_account.update(
      { isEmailVerified: true },
      { where: { email: email.toLowerCase() } }
    );

    return logSuccess(res, "Email verified successfully", {
      email: email,
      verified: true
    });
  } catch (error) {
    console.error("❌ Error verifying OTP:", error.message);
    return logError(res, "Failed to verify OTP", 500);
  }
};

// Resend OTP
exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Validation
    if (!email) {
      return logError(res, "Email is required", 400);
    }

    // Check if email exists
    const emailCheck = await checkEmailExists(email);

    if (!emailCheck.exists) {
      return logError(res, "Email is not registered in our system", 404);
    }

    // Generate new OTP
    const otp = generateOTP();

    // Get user name from either source
    let userName = "User";
    if (emailCheck.source === "user_account" && emailCheck.user) {
      userName = emailCheck.user.full_name || "User";
    }

    // Delete old unverified OTPs for this email
    await db.otp.destroy({
      where: {
        email: email.toLowerCase(),
        isVerified: false
      }
    });

    // Create new OTP record
    await db.otp.create({
      email: email.toLowerCase(),
      otp: otp,
      name: userName,
      isVerified: false
    });

    // Send OTP via email
    await sendOTPEmail(email, otp, userName);

    return logSuccess(res, "New OTP sent successfully to your email", {
      email: email,
      expiresIn: "10 minutes"
    });
  } catch (error) {
    console.error("❌ Error resending OTP:", error.message);
    return logError(res, "Failed to resend OTP", 500);
  }
};

// Check email verification status
exports.checkEmailVerificationStatus = async (req, res) => {
  try {
    const { email } = req.body;

    // Validation
    if (!email) {
      return logError(res, "Email is required", 400);
    }

    // Check if email exists
    const emailCheck = await checkEmailExists(email);

    if (!emailCheck.exists) {
      return logError(res, "Email is not registered in our system", 404);
    }

    // Get verification status
    let isVerified = false;
    if (emailCheck.source === "user_account" && emailCheck.user) {
      isVerified = emailCheck.user.isEmailVerified || false;
    }

    return logSuccess(res, "Email verification status retrieved", {
      email: email,
      isVerified: isVerified,
      source: emailCheck.source
    });
  } catch (error) {
    console.error("❌ Error checking verification status:", error.message);
    return logError(res, "Failed to check verification status", 500);
  }
};

// Initialize SMTP on module load
initSMTP();

module.exports = {
  ...exports,
  checkEmailExists,
  sendOTPEmail
};
