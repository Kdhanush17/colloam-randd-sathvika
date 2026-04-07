var express = require('express');
var { userAuth, adminauth, superAdminAuth,adminAuthToken,unifiedAuthMiddleware,system_user_auth } = require('../middleware/auth');
var router = express.Router();
var st = require('../src/controllers/settings/systemSettingsValidation')
var settings = require('../src/controllers/settings/systemSettingsController');

/*settings start*/
router.get('/getSettings',settings.getSettings) 
router.put('/S3settings',unifiedAuthMiddleware,st.updateSettings,settings.updateSettings)
router.post('/createSystemSetting',settings.createSystemSetting)

module.exports = router;