var express = require('express');
var router = express.Router();
const emailVerificationController = require('../src/controllers/emailVerification/emailVerificationController');

// Send OTP to email
// POST /api/email-verification/send-otp
// Body: { email: "user@example.com" }
router.post('/send-otp', emailVerificationController.sendOTP);

// Verify OTP
// POST /api/email-verification/verify-otp
// Body: { email: "user@example.com", otp: "123456" }
router.post('/verify-otp', emailVerificationController.verifyOTP);

// Resend OTP
// POST /api/email-verification/resend-otp
// Body: { email: "user@example.com" }
router.post('/resend-otp', emailVerificationController.resendOTP);

// Check email verification status
// POST /api/email-verification/check-status
// Body: { email: "user@example.com" }
router.post('/check-status', emailVerificationController.checkEmailVerificationStatus);

module.exports = router;
