// utils/uploadToS3.js
import fs from "fs";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../config/s3.js";

const uploadToS3 = async (file) => {
  const fileStream = fs.createReadStream(file.path);

  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${Date.now()}-${file.originalname}`,
    Body: fileStream,
  };

  await s3.send(new PutObjectCommand(uploadParams));

  // Public URL format for S3
  return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`;
};

export default uploadToS3;
