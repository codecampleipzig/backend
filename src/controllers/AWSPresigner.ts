/**
 * Thanks to Diego!
 * https://gist.github.com/DiegoRodriguez2018/9bd139cddf0570bfd06de965337ceabe
 */

require('dotenv').config(); // Loading dotenv to have access to env variables
const AWS = require('aws-sdk'); // Requiring AWS SDK.
import { awsAccessKeyId, awsSecretAccessKey, awsBucket, awsRegion } from "../configuration";

// Configuring AWS
AWS.config = new AWS.Config({
  accessKeyId: awsAccessKeyId,
  secretAccessKey: awsSecretAccessKey,
  region: awsRegion
});
const Bucket = awsBucket;

// Creating a S3 instance
const s3 = new AWS.S3();


// In order to create pre-signed GET adn PUT URLs we use the AWS SDK s3.getSignedUrl method.
// getSignedUrl(operation, params, callback) ⇒ String
// For more information check the AWS documentation: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html

// GET URL Generator
export function generateGetUrl(Key) {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket,
      Key,
      Expires: 120 // 2 minutes
    };
    // Note operation in this case is getObject
    s3.getSignedUrl('getObject', params, (err, url) => {
      if (err) {
        reject(err);
      } else {
        // If there is no errors we will send back the pre-signed GET URL
        resolve(url);
      }
    });
  });
}

// PUT URL Generator
export function generatePutUrl(Key, ContentType) {
  return new Promise((resolve, reject) => {
    // Note Bucket is retrieved from the env variable above.
    const params = { Bucket, Key, ContentType, ACL: 'bucket-owner-full-control' };
    // Note operation in this case is putObject
    s3.getSignedUrl('putObject', params, function(err, url) {
      if (err) {
        reject(err);
      }
      // If there is no errors we can send back the pre-signed PUT URL
      resolve(url);
    });
  });
}
