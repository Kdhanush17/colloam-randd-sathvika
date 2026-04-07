const contact = require("../../models/contactus"); 
const statusHelper = require("../../../helpers/statusHelper");
const env = require('../../../config/environment');
const userHelper = require("../../../helpers/userHelper");
const nodemailer = require('nodemailer');
const contacthbs = require("../../../views/contact.hbs")
const fs = require('fs'); 
const handlebars = require('handlebars'); 
const logger = require('../../../utils/winston')


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // TLS with STARTTLS
  auth: {
    user: 'kambala.dhanush17@gmail.com',
    pass: 'aowx vlhm xeuu uudx', // This is your Gmail App Password
},
  tls: {
    rejectUnauthorized: false // <- Important for local development
  }
})
async function contactusCreation(req, res) {
  try {
    const { name, email, phoneno, subject, message } = req.body;

    const d_created_date = new Date();
    const formatted_date = `${d_created_date.getFullYear()}-${(d_created_date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${d_created_date.getDate().toString().padStart(2, "0")} ${d_created_date
      .getHours()
      .toString()
      .padStart(2, "0")}:${d_created_date.getMinutes().toString().padStart(2, "0")}:${d_created_date
      .getSeconds()
      .toString()
      .padStart(2, "0")}`;

    // Save to DB
    const data = await contact.create({
      name,
      email,
      phoneno,
      subject,
      message,
      createdDate: formatted_date,
    });

    // Read and compile email template
    const templateString = fs.readFileSync("views/contact.hbs", "utf8");
    const template = handlebars.compile(templateString);
    const renderedTemplate = template({ name, phoneno, email, subject, message });

    // Email Options
    const mailOptions = {
      from: env.smtp.from,
      to: email,
      subject: "Thank you for Contacting Us!",
      html: renderedTemplate,
    };

    // Send mail
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);

    return statusHelper.successResponse(res, "Contactus insertion", data);
  } catch (error) {
    logger.createLog(__filename, error.message, req);
    return logger.error(res, "Exception in contact creation.");
  }
}

async function getContactData (req, res){
    try{

     const contactData = await contact.find()
     if(contactData){
        return statusHelper.successResponse(res, "Contactus data", contactData)
     }else{
        return statusHelper.ErrorResponse(res, "Data not found",[]);
     }

    }catch (error) {
    logger.createLog(__filename, error.message, req);
    return logger.error(res, "Exception in while fetching contact.");
  }
   
}


module.exports = {
    contactusCreation,
    getContactData
}