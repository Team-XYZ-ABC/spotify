/**
 * Test script — validates S3 + CloudFront setup
 * Run: node tests/s3.test.js
 */

import dotenv from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "../.env") });

import { S3Client, PutObjectCommand, DeleteObjectCommand, HeadBucketCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// ─── helpers ────────────────────────────────────────────────────────────────
const pass = (msg) => console.log(`  ✓ ${msg}`);
const fail = (msg, err) => { console.error(`  ✗ ${msg}`); console.error(`    ${err?.message || err}`); process.exitCode = 1; };

// ─── 1. Env vars check ──────────────────────────────────────────────────────
console.log("\n[1] Checking env vars...");
const required = [
    "AWS_REGION", "AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY", "AWS_S3_BUCKET",
    "CLOUDFRONT_DOMAIN", "CLOUDFRONT_KEY_PAIR_ID", "CLOUDFRONT_PRIVATE_KEY"
];

let envOk = true;
for (const key of required) {
    if (!process.env[key] || process.env[key].startsWith("FILL_THIS")) {
        fail(`${key} is missing or not filled`);
        envOk = false;
    } else {
        pass(`${key} is set`);
    }
}

if (!envOk) {
    console.error("\n⚠ Fix missing env vars before continuing.\n");
    process.exit(1);
}

// ─── 2. S3 bucket access ────────────────────────────────────────────────────
console.log("\n[2] Testing S3 bucket access...");
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

try {
    await s3.send(new HeadBucketCommand({ Bucket: process.env.AWS_S3_BUCKET }));
    pass(`Bucket '${process.env.AWS_S3_BUCKET}' accessible`);
} catch (err) {
    fail(`Cannot access bucket '${process.env.AWS_S3_BUCKET}'`, err);
}

// ─── 3. Presigned PUT URL generation ────────────────────────────────────────
console.log("\n[3] Testing presigned upload URL generation...");
const testKey = `test/healthcheck-${Date.now()}.txt`;
try {
    const cmd = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: testKey,
        ContentType: "text/plain",
    });
    const url = await getSignedUrl(s3, cmd, { expiresIn: 60 });
    pass(`Presigned PUT URL generated (${url.slice(0, 70)}...)`);

    // ─── 4. Actual upload via presigned URL ─────────────────────────────────
    console.log("\n[4] Uploading test file via presigned URL...");
    const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "text/plain" },
        body: "spotify-s3-test",
    });
    if (res.ok) {
        pass(`File uploaded to S3 (key: ${testKey})`);
    } else {
        fail(`Upload failed — HTTP ${res.status}`, new Error(await res.text()));
    }

    // ─── 5. Cleanup test file ────────────────────────────────────────────────
    console.log("\n[5] Cleaning up test file...");
    await s3.send(new DeleteObjectCommand({ Bucket: process.env.AWS_S3_BUCKET, Key: testKey }));
    pass("Test file deleted from S3");

} catch (err) {
    fail("Presigned URL test failed", err);
}

// ─── 6. CloudFront signed URL ────────────────────────────────────────────────
console.log("\n[6] Testing CloudFront signed URL generation...");
try {
    const { getSignedUrl: getCFUrl } = await import("@aws-sdk/cloudfront-signer");
    const privateKey = process.env.CLOUDFRONT_PRIVATE_KEY.replace(/\\n/g, "\n");
    const cfUrl = getCFUrl({
        url: `https://${process.env.CLOUDFRONT_DOMAIN}/test/sample.mp3`,
        keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID,
        privateKey,
        dateLessThan: new Date(Date.now() + 3600 * 1000).toISOString(),
    });
    pass(`CloudFront signed URL generated`);
    pass(`URL preview: ${cfUrl.slice(0, 80)}...`);
} catch (err) {
    fail("CloudFront signed URL generation failed", err);
}

// ─── Summary ────────────────────────────────────────────────────────────────
if (process.exitCode === 1) {
    console.log("\n❌ Some tests failed. Fix the errors above.\n");
} else {
    console.log("\n✅ All tests passed! S3 + CloudFront setup is working.\n");
}
