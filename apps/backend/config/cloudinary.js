// import {v2 as cloudinary } from "cloudinary"

// const connectCloudinary = async () => {

//     cloudinary.config({
//         cloud_name: process.env.CLOUDINARY_NAME,
//         api_key:process.env.CLOUDINARY_API_KEY,
//         api_secret:process.env.CLOUDINARY_SECRET_KEY
//     })

// }

// export default connectCloudinary;
// config/s3.js
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export default s3;
