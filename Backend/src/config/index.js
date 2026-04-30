import env from "./env.config.js";

/**
 * Application configuration & dependency-injection registry.
 *
 * Switching an external service (DB, storage, …) should ONLY require
 * editing this file — the rest of the codebase depends on abstractions.
 *
 *   - Change `db.driver` to "postgres" to use PostgresAdapter.
 *   - Change `storage.driver` to "cloudinary" to use CloudinaryAdapter.
 */
const config = {
    env,

    app: {
        port: env.PORT,
        host: env.SERVER_HOST,
        nodeEnv: env.NODE_ENV,
        clientOrigin: env.CLIENT_ORIGIN,
        apiPrefix: "/api/v1",
    },

    auth: {
        jwtSecret: env.JWT_SECRET_KEY,
        jwtExpiresIn: env.JWT_EXPIRES_IN,
        cookieName: "token",
        cookieMaxAgeMs: 7 * 24 * 60 * 60 * 1000,
    },

    // ─── Database ─────────────────────────────────────────────
    db: {
        driver: "mongo", // "mongo" | "postgres"
        uri: env.MONGO_URI,
    },

    // ─── Storage ──────────────────────────────────────────────
    storage: {
        driver: "s3", // "s3" | "cloudinary"
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
    },
};

export default config;
