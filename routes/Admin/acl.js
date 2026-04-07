var express = require('express');
var router = express.Router();

var {unifiedAuthMiddleware} = require('../../middleware/auth');
var acl = require('../../src/controllers/Acl/userAclController'); 

router.post('/createAcl',unifiedAuthMiddleware,acl.createAcl);
router.get('/getAcl',unifiedAuthMiddleware,acl.getAcl);
router.delete('/dropAcl',unifiedAuthMiddleware,acl.dropAcl);
router.post('/createPremission',unifiedAuthMiddleware,acl.createPermission);
router.get('/getUserPermissions',unifiedAuthMiddleware,acl.getUserPermissions)

module.exports = router;
