import dotenv from "dotenv";

dotenv.config();

const env = process.env;

const config = {
    nodeEnv: env.NODE_ENV || "development",
    port: env.PORT || 3000,
    clientOrigin: env.CLIENT_ORIGIN || "http://localhost:5173",
    apiPrefix: "/api/v1",

    auth: {
        jwtSecret: env.JWT_SECRET_KEY,
        jwtExpiresIn: env.JWT_EXPIRES_IN || "7d",
        cookieName: "token",
        cookieMaxAgeMs: 7 * 24 * 60 * 60 * 1000,
    },

    db: {
        uri: env.MONGO_URI,
    },

    s3: {
        region: env.AWS_REGION,
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
        bucket: env.AWS_S3_BUCKET,
        cloudFront: {
            domain: env.CLOUDFRONT_DOMAIN,
            keyPairId: env.CLOUDFRONT_KEY_PAIR_ID,
            privateKey: env.CLOUDFRONT_PRIVATE_KEY,
        },
    },
};

export default config;
