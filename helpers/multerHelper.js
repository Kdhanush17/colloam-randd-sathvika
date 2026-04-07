const multer  = require('multer');
const multerS3 = require('multer-s3')
const path = require( "path" );
const AWS = require("@aws-sdk/client-s3");
const fs = require("fs");
const env = require('../config/environment')
// const config = require("./../config");

// //AWS.config.update({region: 'ap-south-1'});
// console.log('config------------------',config)
const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    region: env.s3.region,
    credentials: {
        accessKeyId: env.s3.accessKeyId,
        secretAccessKey: env.s3.secretAccessKey
      }
});

const instructorProfileImage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/images'); 
      },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '_' + Date.now()  + file.originalname);
    }
});
const uploadProfileImage = multer({storage: instructorProfileImage}).single('image');






  const uploadProfileImageS3 = multer({
    storage: instructorProfileImageS3,
    fileFilter(req, file, cb) {
      // upload only jpeg/jpg/png format
      if (!file.originalname.match(/\.(jpeg|jpg|png)$/)) { 
         return cb(new Error('Please upload a image in jpeg/jpg/png format'))
      }
      cb(undefined, true)
   }}).single('image');

module.exports = {uploadProfileImage,
   uploadProfileImageS3}