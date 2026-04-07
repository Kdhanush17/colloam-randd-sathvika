const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const plansController = require('../src/controllers/plans/planController');
var {system_user_auth,unifiedAuthMiddleware} = require('../middleware/auth'); 

router.post('/createplans',upload.single('planIconFile'),unifiedAuthMiddleware, plansController.createPlan);
router.put('/updateplans',upload.single('planIconFile'),unifiedAuthMiddleware, plansController.updatePlan);
router.delete('/deleteplans', unifiedAuthMiddleware,unifiedAuthMiddleware,plansController.deletePlan);
router.get('/getplans', plansController.getPlans);


module.exports = router;
