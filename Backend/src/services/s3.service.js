import { PutObjectCommand, DeleteObjectCommand, GetObjectCommand, PutBucketCorsCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getSignedUrl as getCFSignedUrl } from "@aws-sdk/cloudfront-signer";
import s3 from "../configs/s3.config.js";
import CONFIG from "../configs/env.config.js";

/**
 * Generate a presigned S3 GET URL for serving content (images + audio).
 * This bypasses CloudFront and works immediately without OAC bucket policy setup.
 * @param {string} key       - S3 object key
 * @param {number} expiresIn - Seconds until URL expires (default 1 hour)
 */
export const getPresignedGetUrl = async (key, expiresIn = 3600) => {
    const command = new GetObjectCommand({
        Bucket: CONFIG.AWS_S3_BUCKET,
        Key: key,
    });
    return await getSignedUrl(s3, command, { expiresIn });
};

/**
 * Extract S3 key from a stored CloudFront URL.
 * e.g. "https://dsn1fo.cloudfront.net/covers/abc.jpg" → "covers/abc.jpg"
 */
export const getS3KeyFromUrl = (url) => {
    if (!url) return null;
    try {
        return new URL(url).pathname.replace(/^\//, "");
    } catch {
        return null;
    }
};

/**
 * Generate a presigned S3 PUT URL so the frontend can upload directly to S3.
 * @param {string} key        - S3 object key (e.g. "audio/userId/uuid.mp3")
 * @param {string} contentType - MIME type (e.g. "audio/mpeg", "image/jpeg")
 * @param {number} expiresIn  - Seconds until URL expires (default 5 min)
 */
export const getPresignedUploadUrl = async (key, contentType, expiresIn = 300) => {
    const command = new PutObjectCommand({
        Bucket: CONFIG.AWS_S3_BUCKET,
        Key: key,
        ContentType: contentType,
    });
    return await getSignedUrl(s3, command, { expiresIn });
};

/**
 * Generate a CloudFront signed URL for private/secure content delivery (audio).
 * @param {string} key          - S3 object key
 * @param {number} expiresIn    - Seconds until URL expires (default 1 hour)
 */
export const getCloudFrontSignedUrl = (key, expiresIn = 3600) => {
    const url = `https://${CONFIG.CLOUDFRONT_DOMAIN}/${key}`;
    // Handle both multiline PEM (from dotenv quoted block) and single-line with \n escapes
    const privateKey = CONFIG.CLOUDFRONT_PRIVATE_KEY.includes("\\n")
        ? CONFIG.CLOUDFRONT_PRIVATE_KEY.replace(/\\n/g, "\n")
        : CONFIG.CLOUDFRONT_PRIVATE_KEY;
    return getCFSignedUrl({
        url,
        keyPairId: CONFIG.CLOUDFRONT_KEY_PAIR_ID,
        privateKey,
        dateLessThan: new Date(Date.now() + expiresIn * 1000).toISOString(),
    });
};

/**
 * Return a plain (public) CloudFront URL — used for images (covers, avatars).
 * @param {string} key - S3 object key
 */
export const getCloudFrontUrl = (key) => {
    return `https://${CONFIG.CLOUDFRONT_DOMAIN}/${key}`;
};

/**
 * Delete an object from S3 by key.
 * @param {string} key - S3 object key
 */
export const deleteS3Object = async (key) => {
    const command = new DeleteObjectCommand({
        Bucket: CONFIG.AWS_S3_BUCKET,
        Key: key,
    });
    await s3.send(command);
};

/**
 * Configure CORS on the S3 bucket so browsers can PUT via presigned URLs.
 * Called once on server startup — idempotent (safe to call multiple times).
 */
export const setupS3Cors = async () => {
    const command = new PutBucketCorsCommand({
        Bucket: CONFIG.AWS_S3_BUCKET,
        CORSConfiguration: {
            CORSRules: [
                {
                    AllowedOrigins: ["*"],
                    AllowedMethods: ["GET", "PUT", "POST", "HEAD"],
                    AllowedHeaders: ["*"],
                    ExposeHeaders: ["ETag"],
                    MaxAgeSeconds: 3000,
                },
            ],
        },
    });
    await s3.send(command);
    console.log("[S3] CORS configuration applied successfully");
};
