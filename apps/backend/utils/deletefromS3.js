// utils/deleteFromS3.js
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../config/s3.js";

const deleteFromS3 = async (key) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  };

  await s3.send(new DeleteObjectCommand(params));
};

export default deleteFromS3;
