import dotenv from "dotenv";

dotenv.config();

/**
 * Centralised environment-variable accessor.
 * Keep this file dumb — only read & expose values, never side-effects.
 */
const env = {
    // Server
    PORT: process.env.PORT || 3000,
    SERVER_HOST: process.env.SERVER_HOST || `http://localhost:${process.env.PORT || 3000}`,
    NODE_ENV: process.env.NODE_ENV || "development",

    // Auth
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",

    // Database
    MONGO_URI: process.env.MONGO_URI,

    // AWS S3
    AWS_REGION: process.env.AWS_REGION,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,

    // CloudFront
    CLOUDFRONT_DOMAIN: process.env.CLOUDFRONT_DOMAIN,
    CLOUDFRONT_KEY_PAIR_ID: process.env.CLOUDFRONT_KEY_PAIR_ID,
    CLOUDFRONT_PRIVATE_KEY: process.env.CLOUDFRONT_PRIVATE_KEY,

    // CORS
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "http://localhost:5173",
};

export default env;
