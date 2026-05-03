import {
    S3Client,
    GetObjectCommand,
    PutObjectCommand,
    DeleteObjectCommand,
    DeleteObjectsCommand,
    ListObjectsV2Command,
    PutBucketCorsCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getSignedUrl as cfSignedUrl } from "@aws-sdk/cloudfront-signer";
import config from "../config.js";

const { s3 } = config;

const client = new S3Client({
    region: s3.region,
    credentials: {
        accessKeyId: s3.accessKeyId,
        secretAccessKey: s3.secretAccessKey,
    },
});

export const getReadUrl = (key, expiresIn = 3600) =>
    getSignedUrl(client, new GetObjectCommand({ Bucket: s3.bucket, Key: key }), {
        expiresIn,
    });

export const getWriteUrl = (key, contentType, expiresIn = 300) =>
    getSignedUrl(
        client,
        new PutObjectCommand({ Bucket: s3.bucket, Key: key, ContentType: contentType }),
        { expiresIn }
    );

export const getPublicUrl = (key) =>
    s3.cloudFront?.domain
        ? `https://${s3.cloudFront.domain}/${key}`
        : `https://${s3.bucket}.s3.${s3.region}.amazonaws.com/${key}`;

export const getKeyFromUrl = (url) => {
    if (!url) return null;
    try {
        return new URL(url).pathname.replace(/^\//, "");
    } catch {
        return null;
    }
};

export const deleteObject = async (key) => {
    await client.send(new DeleteObjectCommand({ Bucket: s3.bucket, Key: key }));
};

export const uploadObject = async (key, body, contentType) => {
    await client.send(
        new PutObjectCommand({
            Bucket: s3.bucket,
            Key: key,
            Body: body,
            ContentType: contentType,
        })
    );
};

export const downloadObject = async (key) => {
    const res = await client.send(
        new GetObjectCommand({ Bucket: s3.bucket, Key: key })
    );
    return res.Body; // Readable stream
};

export const deletePrefix = async (prefix) => {
    if (!prefix) return;
    let ContinuationToken;
    do {
        const listed = await client.send(
            new ListObjectsV2Command({
                Bucket: s3.bucket,
                Prefix: prefix,
                ContinuationToken,
            })
        );
        const objects = (listed.Contents || []).map((o) => ({ Key: o.Key }));
        if (objects.length) {
            await client.send(
                new DeleteObjectsCommand({
                    Bucket: s3.bucket,
                    Delete: { Objects: objects, Quiet: true },
                })
            );
        }
        ContinuationToken = listed.IsTruncated ? listed.NextContinuationToken : undefined;
    } while (ContinuationToken);
};

export const getSignedStreamUrl = (key, expiresIn = 3600) => {
    const cf = s3.cloudFront;
    if (!cf?.domain || !cf.keyPairId || !cf.privateKey) {
        throw new Error("CloudFront is not configured");
    }
    const url = `https://${cf.domain}/${key}`;
    const privateKey = cf.privateKey.includes("\\n")
        ? cf.privateKey.replace(/\\n/g, "\n")
        : cf.privateKey;
    return cfSignedUrl({
        url,
        keyPairId: cf.keyPairId,
        privateKey,
        dateLessThan: new Date(Date.now() + expiresIn * 1000).toISOString(),
    });
};

export const setupCors = async () => {
    await client.send(
        new PutBucketCorsCommand({
            Bucket: s3.bucket,
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
        })
    );
    console.log("[s3] CORS configuration applied");
};
