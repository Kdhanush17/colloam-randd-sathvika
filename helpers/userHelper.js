const config = require("../config/environment");
const bcrypt = require("bcryptjs");
const User = require("../src/models/userAccount");
// const system_users = require('../src/models/systemUser')
const nodemailer = require('nodemailer');
const db = require('../src/models/index')
const { v4: uuidv4 } = require('uuid');
const jwt = require("jsonwebtoken");
const { Service } = require("aws-sdk");
const hbs = require('handlebars');
const fs = require('fs');
const path = require('path');
var { getsmtpdetails } = require('../src/controllers/lib/systemSettings');

let transporter;

async function initSMTP() {
  try {
    let smtpDetails = await getsmtpdetails();

    if (!smtpDetails.status) {
      throw new Error(smtpDetails.errorMessage);
    }

    smtpDetails = smtpDetails.data;

    // ✅ Use SMTP details from DB
    transporter = nodemailer.createTransport({
      host: smtpDetails.host,
      port: smtpDetails.port,
      secure: smtpDetails.port == 465, // true for 465, false for other ports
      auth: {
        user: smtpDetails.user,
        pass: smtpDetails.pass,
      }
    });

    console.log("✅ SMTP Transporter Initialized");
  } catch (err) {
    console.error("❌ Failed to initialize SMTP:", err.message);
    transporter = null; // fallback → don’t crash app
  }
}

// Call initializer when file loads
initSMTP();

// const transporter = nodemailer.createTransport({
//   host: config.smtp.host,
//   port: config.smtp.port,
//   secure: false,
//   auth: {
//     user: config.smtp.user,
//     pass: config.smtp.pass
//   }
// });
async function sendVerificationCodeForPassword(email) {
  const userdetails = await User.findOne({ email });
  if (userdetails) {
    const confirmationCode = randomNum();
    const currenttime = new Date();
    const templatePath = path.join(__dirname, '../views/forgotPasswordMail.hbs');
    const templateString = fs.readFileSync(templatePath, 'utf8');
    const template = hbs.compile(templateString);
    const renderedTemplate = template({
      userName: `${userdetails.first_name} ${userdetails.last_name}`,
      confirmationCode
    });
    let smtpDetails = await getsmtpdetails();
    if (!smtpDetails.status) {
      throw new Error(smtpDetails.errorMessage);
    }

    smtpDetails = smtpDetails.data;

    const mailOptions = {
      from: smtpDetails.from,
      to: email,
      subject: 'Your Resource Central - Password Reset OTP',
      html: renderedTemplate,
    };

    // console.log("mailOptions", mailOptions);

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return statusHelper.ErrorResponse(res, "Failed to send email", 500);
      } else {
        // console.log('Email sent: ' + info.response);
        return statusHelper.successResponse(res, "Request for Quote submitted successfully", newRequestQuote);
      }
    });

    await User.updateOne({ email }, {
      otp: confirmationCode,
      otpExpiration: new Date(currenttime.getTime() + 1 * 60 * 1000)
    });
    return confirmationCode;
  }
  return 0;
}

const generateUniquePassword = () => {
  const randomString = Math.random().toString(36).slice(-8);
  const timestamp = Date.now().toString().slice(-4);
  return `Job@${randomString}${timestamp}`;
};

async function sendVerificationCodeForAccountActivate(email) {
  const userdetails = await User.findOne({ email });
  if (userdetails) {
    const confirmationCode = randomNum();
    const currenttime = new Date();

    const templatePath = path.join(__dirname, '../views/accountVerification.hbs');
    const templateString = fs.readFileSync(templatePath, 'utf8');
    const template = hbs.compile(templateString);
    const renderedTemplate = template({
      userName: `${userdetails.first_name} ${userdetails.last_name}`,
      confirmationCode
    });
    let smtpDetails = await getsmtpdetails();
    if (!smtpDetails.status) {
      throw new Error(smtpDetails.errorMessage);
    }

    smtpDetails = smtpDetails.data;


    const mailOptions = {
      from: smtpDetails.from,
      to: email,
      subject: 'Your Farm Stay - Account Verification OTP',
      html: renderedTemplate,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return statusHelper.ErrorResponse(res, "Failed to send email", 500);
      } else {
        console.log('Email sent: ' + info.response);
        return statusHelper.successResponse(res, "Request for Quote submitted successfully", newRequestQuote);
      }
    });

    await User.updateOne({ email }, {
      otp: confirmationCode,
      otpExpiration: new Date(currenttime.getTime() + 1 * 60 * 1000)
    });
    return confirmationCode;
  }
  return 0;
}

async function otpTimeVerification(otpExpiration) {
  const currentTime = new Date();
  return currentTime <= otpExpiration;
}


function randomNum() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
okencheck = async function (req, res, next) {
  res.send({ status: true, message: "Authenticate successfull", data: req.user });
}



function generateUuid() {
  const uuid = uuidv4();
  return uuid;
}

const minLength = 3;
const maxLength = 30;

function validateLength(field, fieldName) {
  if (field.length < minLength || field.length > maxLength) {
    return ` ${fieldName} must be between ${minLength} and ${maxLength} characters`;
  }
  return null;
}

function isEmailValid(email) {

  //Email format Validation
  var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return mailformat.test(String(email));
}

function validatePassword(password) {
  var passwordformat = /^[a-zA-Z0-9!@#$%^&*]{8,16}$/;
  return passwordformat.test(String(password));
}

async function generateToken(user, email, userType, isLoggedin, adminEncryptedToken = null) {
  let userId = user._id;
  const token = jwt.sign({
    email,
    userType,
    userId,
    isLoggedin
  },
    "secret"
    // {
    //   expiresIn: "24h",
    // }
  );
  //Encrypting token
  var encryptedToken = encrypt(token);
  if (adminEncryptedToken) {
    encryptedToken = adminEncryptedToken
  }
  // const encryptedToken = encrypt(token);

  // save user token
  await db.user_account.updateOne({
    email: email.toLowerCase()
  }, {
    jwtToken: encryptedToken,
    updated_at: new Date()
  });
  var result = {
    'first_name': user_account.first_name,
    'last_name': user_account.last_name,
    '_id': user_account._id,
    'email': email,
    'mobile_number': user_account.mobile_number,
    'status': user_account.status,
    'user_code': user_account.user_code,
    'JWT': encryptedToken.iv
  };
  // console.log("result userHelper  ::",result);
  return result;
}

function encrypt(token) {
  const uuid = generateUuid();
  return {
    iv: uuid,
    encryptedData: token.toString()
  };
}

async function getUserIdByEmail(email) {
  const userData = await db.user_account.findOne({
    email: email?.toLowerCase(),
    status: true
  });
  if (userData) {
    return userData._id;
  } else {
    return null;
  }
}
async function getSuperAdminIdByEmail(userCode) {
  if (!userCode) return null;
  const userData = await db.SuperAdmin.findOne({
    superAdminCode: userCode,
    status: true
  });
  console.log("userData :", userData)
  if (userData) {
    return userData._id;
  } else {
    return null;
  }
}

async function getUserNameByID(userId) {
  const userData = await User.findOne({
    _id: userId
  });
  if (userData) {
    return `${userData.first_name} ${userData.last_name}`;
  } else {
    return null;
  }
}
async function getUserEmailByID(userId) {
  const userData = await User.findOne({
    _id: userId
  });
  if (userData) {
    return userData.email;
  } else {
    return null;
  }
}

async function getAdminUserIdByEmail(email) {
  // const userData = await system_users.findOne({
  //   email: email?.toLowerCase()
  // });
  // console.log("userData",userData)
  if (userData) {
    return userData._id;
  } else {
    return null;
  }
}
async function getBookingsByEmail(email) {
  let foundUser = await User.findOne({ email: email }).lean();
  // console.log("foundUser", foundUser);

  if (foundUser != null && foundUser.bookingDetails != null) {
    let bookingDetails = foundUser.bookingDetails;
    let couponName;
    let bookingInfo;
    let bookingInfoItemCode;
    let discountPercentage = 0;
    let payLater = false;
    let payLaterAmount = 0;

    if (foundUser.bookingInfo != null) {
      bookingInfo = foundUser.bookingInfo;
      for (let i = 0; i < bookingInfo.length; i++) {
        bookingInfoItemCode = bookingInfo[i].item_code;
        couponName = bookingInfo[i].couponName;
        discountPercentage = bookingInfo[i].discountPercentage || 0;
      }
    }

    if (foundUser.payLaterInfo != null) {
      let payLaterInfo = foundUser.payLaterInfo;
      for (let i = 0; i < payLaterInfo.length; i++) {
        payLater = payLaterInfo[i].payLater || false; // Check if pay-later option is selected
      }
    }

    let subTotal = 0;
    let finalDiscountValue = 0;
    let subTotalWithDiscount = 0;
    let bookingList = [];

    for (let i = 0; i < bookingDetails.length; i++) {
      if (bookingDetails[i]?.item_code != null) {
        let foundItem = await items.findOne({
          item_code: bookingDetails[i].item_code,
          item_status: "ACTIVE"
        });
        if (foundItem != null) {
          bookingDetails[i].item_name = foundItem.item_name;
          bookingDetails[i].item_price = parseFloat(foundItem.item_price);
          bookingDetails[i].item_main_image = foundItem.item_main_image;

          if (bookingInfoItemCode != null) {
            let cartInfoResult = bookingInfoItemCode.includes(bookingDetails[i].item_code);
            if (cartInfoResult) {
              let discountValue = bookingDetails[i].item_price * (discountPercentage / 100);
              discountValue = Math.ceil(discountValue);
              finalDiscountValue += discountValue;
              subTotalWithDiscount = (bookingDetails[i].item_price * bookingDetails[i].total_len_days) - discountValue;
            }
          }

          if (subTotalWithDiscount === 0) {
            subTotal = (subTotal + bookingDetails[i].item_price) * bookingDetails[i].total_len_days;
          } else {
            subTotal += subTotalWithDiscount;
            subTotalWithDiscount = 0; // Reset subTotalWithDiscount for next iteration
          }

          bookingList.push(bookingDetails[i]);
        }
      }
    }

    let taxPercentage = 5;
    let taxValue = subTotal * (taxPercentage / 100);
    taxValue = Math.ceil(taxValue);
    let total = subTotal + taxValue;

    if (payLater) {
      if (discountPercentage > 0) {
        // Calculate payLaterAmount based on discounted subtotal
        payLaterAmount = (subTotal - finalDiscountValue) / 2;
      } else {
        // Calculate payLaterAmount based on normal subtotal
        payLaterAmount = subTotal / 2;
      }
      payLaterAmount = Math.ceil(payLaterAmount); // Round up to the nearest integer
      subTotal = payLaterAmount; // Replace subTotal with payLaterAmount
      total = payLaterAmount + taxValue; // Replace total with payLaterAmount + taxValue
      remainingBalanceAmount = (subTotal * 2) - payLaterAmount;
    }

    return {
      subTotal: subTotal,
      subTotalWithDiscount: subTotalWithDiscount,
      currencyCode: "INR",
      couponName: couponName,
      discountPercentage: discountPercentage,
      discountValue: finalDiscountValue,
      taxPercentage: taxPercentage,
      taxValue: taxValue,
      total: total,
      payLaterStatus: payLater,
      payLaterAmount: payLater ? payLaterAmount : null, // Return payLaterAmount if payLater is true
      remainingBalanceAmount: payLater ? remainingBalanceAmount : null,
      items: bookingList
    };
  }

  return null; // Handle case when foundUser or foundUser.bookingDetails is null
}

// ==============================
// EMAIL VERIFICATION HELPERS
// ==============================

// Check if email is registered in both user_account and database_mappings tables
async function isEmailRegistered(email) {
  try {
    if (!email) return false;

    // Check in user_account table
    const userAccount = await db.user_account.findOne({
      where: { email: email.toLowerCase() }
    });

    if (userAccount) {
      return {
        isRegistered: true,
        source: "user_account",
        user: userAccount
      };
    }

    // Check in database_mappings table
    const dbMapping = await db.database_mappings.findOne({
      where: { email: email.toLowerCase() }
    });

    if (dbMapping) {
      return {
        isRegistered: true,
        source: "database_mappings",
        mapping: dbMapping
      };
    }

    return {
      isRegistered: false,
      source: null
    };
  } catch (error) {
    console.error("Error checking email registration:", error.message);
    throw error;
  }
}

// Get email verification status
async function getEmailVerificationStatus(email) {
  try {
    if (!email) return null;

    const user = await db.user_account.findOne({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      return null;
    }

    return {
      email: email,
      isVerified: user.isEmailVerified || false,
      verificationToken: user.emailVerificationToken || null
    };
  } catch (error) {
    console.error("Error getting email verification status:", error.message);
    throw error;
  }
}


module.exports = {
  generateUniquePassword, generateUuid, isEmailValid, validatePassword, generateToken, validateLength, getUserIdByEmail, getBookingsByEmail, getAdminUserIdByEmail, sendVerificationCodeForPassword,
  otpTimeVerification, getUserNameByID, getUserEmailByID, sendVerificationCodeForAccountActivate, getSuperAdminIdByEmail,
  initSMTP, isEmailRegistered, getEmailVerificationStatus
}

module.exports = {
  generateUniquePassword, generateUuid, isEmailValid, validatePassword, generateToken, validateLength, getUserIdByEmail, getBookingsByEmail, getAdminUserIdByEmail, sendVerificationCodeForPassword,
  otpTimeVerification, getUserNameByID, getUserEmailByID, sendVerificationCodeForAccountActivate, getSuperAdminIdByEmail,
  initSMTP, isEmailRegistered, getEmailVerificationStatus
}