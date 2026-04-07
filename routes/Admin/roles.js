var express = require('express');
var router = express.Router();

var {unifiedAuthMiddleware} = require('../../middleware/auth');   
var role = require('../../src/controllers/roles/roleController'); 
var rv = require('../../src/controllers/roles/roleValidation');  

router.post('/createRole',rv.createRole,role.createRole);
router.put('/updateRole',unifiedAuthMiddleware,rv.updateRole,role.updateRole);
router.get('/getRoles',role.getRoles);
router.delete('/deleteRole',unifiedAuthMiddleware,role.deleteRole);
router.get('/getRolesByAdmin',unifiedAuthMiddleware,role.getRolesByAdmin);
router.get('/getRoleByName',role.getRoleByName);

module.exports = router;
