const express = require("express");
const router = express.Router();

const contactValidator = require("../src/controllers/contactus/contactUsValidator");
const contactController = require("../src/controllers/contactus/contactusController"); 

router.post("/contactCreation",contactValidator.contactFormValidation,contactController.contactusCreation); 
router.get("/getContactData",contactController.getContactData);

module.exports = router;