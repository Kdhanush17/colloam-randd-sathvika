// const config = require("./../config")
const AWS = require("aws-sdk");
const fs = require("fs");
const env = require('../config/environment')

// AWS.config.update({region: 'ap-south-1'});
const s3 = new AWS.S3({
    accessKeyId: env.s3.accessKeyId,
    secretAccessKey: env.s3.secretAccessKey,
    apiVersion: '2006-03-01',
    apiRegion : env.s3.region
});

const region = env.s3.region;


async function createBucket(bucketName){
    const bucketParams = {
        Bucket: bucketName
        // CreateBucketConfiguration: {
        //     // Set your region here
        //     LocationConstraint: region
        // }
    };

    s3.createBucket(bucketParams, function(err, data) {
        if (err) console.log(err, err.stack);
        else {
            console.log('Bucket Created Successfully', data.Location);
            return data.Location;
        }
    });
}


async function uploadBucket(bucketName,filePath,objectName){
        // Read content from the file
        const fileContent = fs.readFileSync(filePath);

        // Setting up S3 upload parameters
        const bucketParams = {
            Bucket: bucketName,
            Key: objectName, // File name you want to save as in S3
            Body: fileContent
        };

        // Uploading files to the bucket
        s3.upload(bucketParams, function(err, data) {
            if (err) {
                throw err;
            }
            console.log(`File uploaded successfully. ${data.Location}`);
        });

// var fileStream = fs.createReadStream(file);
// fileStream.on('error', function(err) {
//   console.log('File Error', err);
// });
// uploadParams.Body = fileStream;
// var path = require('path');
// uploadParams.Key = path.basename(file);
}

async function listBucketObjects(bucketName){

    const bucketParams = {
        Bucket: bucketName
      };
    s3.listObjects(bucketParams,function(err, data) {
        if (err) {
          console.log("Error", err);
        } else {
          console.log("Success", data);
        }
      });
}

async function listBuckets(){

    s3.listBuckets(function(err, data) {
        if (err) {
          console.log("Error", err);
        } else {
          console.log("Success", data);
        }
      });
}

 async function deleteBucketObject(bucketName,objectName){
  try{

var bucketParams = {
    Bucket : bucketName,
    Key : objectName
  };

  // Call S3 to delete the bucket
   s3.deleteObject(bucketParams, function(err, data) {
    if (err) {
      console.log("Error", err);
      return false;
    } else {
      console.log("Success", data);
      return true;
    }
  });
}
catch(err){
  console.log("deleteBucketObject" , err);
}
}

async function deleteBucket(bucketName){
    var bucketParams = {
        Bucket : bucketName
      };

      // Call S3 to delete the bucket
      s3.deleteBucket(bucketParams, function(err, data) {
        if (err) {
          console.log("Error", err);
        } else {
          console.log("Success", data);
        }
      });
    }



module.exports = {createBucket,uploadBucket,listBucketObjects,listBuckets,deleteBucketObject,deleteBucket}
