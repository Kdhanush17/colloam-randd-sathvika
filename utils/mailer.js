const nodemailer = require("nodemailer");
const { SystemSettings } = require("../src/models"); // ✅ Sequelize model

let transporter = null;
let smtpCache = null;


// ==============================
// 🔹 Get SMTP Settings (DB)
// ==============================
const getSMTPDetails = async () => {
  if (smtpCache) return smtpCache;

  const smtp = await SystemSettings.findOne({
    where: { key: "SMTP" } // adjust based on your schema
  });

  if (!smtp) {
    throw new Error("SMTP settings not found");
  }

  smtpCache = smtp.dataValues || smtp;
  return smtpCache;
};


// ==============================
// 🔹 Initialize SMTP
// ==============================
async function initSMTP() {
  try {
    const smtpDetails = await getSMTPDetails();

    transporter = nodemailer.createTransport({
      host: smtpDetails.host,
      port: smtpDetails.port,
      secure: smtpDetails.port == 465,
      auth: {
        user: smtpDetails.user,
        pass: smtpDetails.pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    console.log("✅ SMTP Transporter Initialized");

  } catch (err) {
    console.error("❌ Failed to initialize SMTP:", err.message);
    transporter = null;
  }
}

// Initialize on load
initSMTP();


// ==============================
// 🔹 Send Password Email
// ==============================
const sendPasswordEmail = async (toEmail, plainPassword, recruiterName) => {
  try {
    if (!transporter) {
      await initSMTP(); // retry once
      if (!transporter) {
        throw new Error("SMTP transporter not initialized");
      }
    }

    const smtpDetails = await getSMTPDetails();

    const mailOptions = {
      from: smtpDetails.from,
      to: toEmail,
      subject: "Your Recruiter Account Credentials",
      html: `
        <p>Hi ${recruiterName},</p>
        <p>Your recruiter account has been created. Below are your login credentials:</p>
        <p><b>Email:</b> ${toEmail}<br><b>Password:</b> ${plainPassword}</p>
        <p>Please change your password after first login.</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent:", info.response);

  } catch (error) {
    console.error("❌ Email Error:", error.message);
    throw error;
  }
};


module.exports = {
  initSMTP,
  sendPasswordEmail
};