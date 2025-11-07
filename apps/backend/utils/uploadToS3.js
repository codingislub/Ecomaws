// utils/uploadToS3.js
import fs from "fs";
import path from "path";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../config/s3.js";

const uploadToS3 = async (file) => {
  // Multer provides `path`, `originalname`, and `mimetype`
  const fileStream = fs.createReadStream(file.path);

  // Sanitize filename (remove spaces and risky chars)
  const safeName = file.originalname
    .replace(/[^a-zA-Z0-9_.-]/g, "-")
    .replace(/-+/g, "-");

  const key = `${Date.now()}-${safeName}`;

  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: fileStream,
    ContentType: file.mimetype || undefined,
    // Only set ACL when explicitly allowed (bucket must permit ACLs)
    ...(process.env.AWS_S3_PUBLIC_READ === "true" ? { ACL: "public-read" } : {}),
    // Cache images for a day by default
    CacheControl: process.env.S3_CACHE_CONTROL || "public, max-age=86400",
  };

  await s3.send(new PutObjectCommand(uploadParams));

  // Prefer a CDN/base URL if provided (e.g., CloudFront or S3 website endpoint)
  const baseUrl = process.env.PUBLIC_ASSET_BASE_URL?.replace(/\/$/, "");
  if (baseUrl) {
    return `${baseUrl}/${key}`;
  }

  // Default virtual-hosted–style URL
  const region = process.env.AWS_REGION;
  const bucket = process.env.AWS_BUCKET_NAME;
  // us-east-1 supports both styles; keep consistent with region-based URL
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
};

export default uploadToS3;
