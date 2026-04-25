import dotenv from 'dotenv'

dotenv.config()

const CONFIG = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    SERVER_HOST: process.env.SERVER_HOST,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    NODE_ENV: process.env.NODE_ENV,

    // AWS S3
    AWS_REGION: process.env.AWS_REGION,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,

    // CloudFront
    CLOUDFRONT_DOMAIN: process.env.CLOUDFRONT_DOMAIN,
    CLOUDFRONT_KEY_PAIR_ID: process.env.CLOUDFRONT_KEY_PAIR_ID,
    CLOUDFRONT_PRIVATE_KEY: process.env.CLOUDFRONT_PRIVATE_KEY,
}

export default CONFIG