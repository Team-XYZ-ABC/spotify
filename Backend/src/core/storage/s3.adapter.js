import {
    S3Client,
    GetObjectCommand,
    PutObjectCommand,
    DeleteObjectCommand,
    PutBucketCorsCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getSignedUrl as getCFSignedUrl } from "@aws-sdk/cloudfront-signer";
import StorageInterface from "./storage.interface.js";
import logger from "../logger/logger.js";

const log = logger.child("s3");

export default class S3Adapter extends StorageInterface {
    constructor(s3Config) {
        super();
        this.config = s3Config;
        this.client = new S3Client({
            region: s3Config.region,
            credentials: {
                accessKeyId: s3Config.accessKeyId,
                secretAccessKey: s3Config.secretAccessKey,
            },
        });
    }

    async getReadUrl(key, expiresIn = 3600) {
        const cmd = new GetObjectCommand({ Bucket: this.config.bucket, Key: key });
        return getSignedUrl(this.client, cmd, { expiresIn });
    }

    async getWriteUrl(key, contentType, expiresIn = 300) {
        const cmd = new PutObjectCommand({
            Bucket: this.config.bucket,
            Key: key,
            ContentType: contentType,
        });
        return getSignedUrl(this.client, cmd, { expiresIn });
    }

    getPublicUrl(key) {
        const domain = this.config.cloudFront?.domain;
        if (!domain) return `https://${this.config.bucket}.s3.${this.config.region}.amazonaws.com/${key}`;
        return `https://${domain}/${key}`;
    }

    getSignedStreamUrl(key, expiresIn = 3600) {
        const cf = this.config.cloudFront;
        if (!cf?.domain || !cf.keyPairId || !cf.privateKey) {
            throw new Error("CloudFront is not configured");
        }
        const url = `https://${cf.domain}/${key}`;
        const privateKey = cf.privateKey.includes("\\n")
            ? cf.privateKey.replace(/\\n/g, "\n")
            : cf.privateKey;
        return getCFSignedUrl({
            url,
            keyPairId: cf.keyPairId,
            privateKey,
            dateLessThan: new Date(Date.now() + expiresIn * 1000).toISOString(),
        });
    }

    async delete(key) {
        const cmd = new DeleteObjectCommand({ Bucket: this.config.bucket, Key: key });
        await this.client.send(cmd);
    }

    getKeyFromUrl(url) {
        if (!url) return null;
        try {
            return new URL(url).pathname.replace(/^\//, "");
        } catch {
            return null;
        }
    }

    async setupCors() {
        const cmd = new PutBucketCorsCommand({
            Bucket: this.config.bucket,
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
        await this.client.send(cmd);
        log.info("CORS configuration applied successfully");
    }
}
