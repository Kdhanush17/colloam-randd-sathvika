var express = require('express');
var router = express.Router();
const multer = require('multer');
const upload = multer();
var { userAuth, unifiedAuthMiddleware, system_user_auth } = require('../middleware/auth');
// const { unifiedAuthMiddleware, superAdminPermissionAuth } = require('../middleware/auth');
var superAdminController = require('../src/controllers/superAdmin/superAdminController');
var sav = require('../src/controllers/superAdmin/superAdminValidations');

router.post('/superAdminCreate',sav.superAdminCreate, superAdminController.superAdminCreate);
router.get('/tokencheck',unifiedAuthMiddleware, superAdminController.tokencheck);

// Wrap UserSignup with error handler
router.post('/UserSignup', async (req, res) => {
  try {
    await superAdminController.UserSignup(req, res);
  } catch (error) {
    console.error('Route Error:', error);
    if (res && typeof res.status === 'function') {
      return res.status(500).json({ message: error.message || "Internal Server Error" });
    }
  }
});

router.post('/unifiedLogin', superAdminController.unifiedLogin);
router.post('/forgot-password', superAdminController.forgotPassword);
router.post('/reset-password', superAdminController.resetPassword);
router.post('/refresh-token', superAdminController.refreshToken);
router.post('/logout', unifiedAuthMiddleware, superAdminController.logout);
router.get('/getWorkspaceDetails', unifiedAuthMiddleware, superAdminController.getAllWorkspacesForSuperAdmin);
router.post('/updateWorkspaceDetails', unifiedAuthMiddleware, superAdminController.updateWorkspaceDetails);

module.exports = router;


