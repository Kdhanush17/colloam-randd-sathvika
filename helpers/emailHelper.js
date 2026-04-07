const nodemailer = require("nodemailer");
var { getsmtpdetails } = require('../../controllers/lib/systemSettings');

let smtpDetails = await getsmtpdetails();

if (!smtpDetails.status) {
  // If details not found, throw error → force app not to start
  throw new Error(smtpDetails.errorMessage);
}

smtpDetails = smtpDetails.data;

// ✅ Use SMTP details from DB
const transporter = nodemailer.createTransport({
  host: smtpDetails.host,
  port: smtpDetails.port,
  secure: smtpDetails.port == 465, // true for 465, false for other ports
  auth: {
    user: smtpDetails.user,
    pass: smtpDetails.pass,
  }
});

exports.sendPasswordEmail = async (toEmail, plainPassword, recruiterName) => {
  await transporter.sendMail({
    from: `"${smtpDetails.sender_name}" <${smtpDetails.sender_mail}>`,
    to: toEmail,
    subject: "Your Recruiter Account Credentials",
    html: `
      <p>Hi ${recruiterName},</p>
      <p>Your recruiter account has been created. Below are your login credentials:</p>
      <p><b>Email:</b> ${toEmail}<br><b>Password:</b> ${plainPassword}</p>
      <p>Please change your password after logging in for the first time.</p>
    `
  });
};
