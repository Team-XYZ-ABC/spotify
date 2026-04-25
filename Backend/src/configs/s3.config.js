import { S3Client } from "@aws-sdk/client-s3";
import CONFIG from "./env.config.js";

const s3 = new S3Client({
    region: CONFIG.AWS_REGION,
    credentials: {
        accessKeyId: CONFIG.AWS_ACCESS_KEY_ID,
        secretAccessKey: CONFIG.AWS_SECRET_ACCESS_KEY,
    },
});

export default s3;
