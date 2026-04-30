/* eslint-disable no-unused-vars */

/**
 * Object-storage abstraction contract.
 *
 * All providers (S3, Cloudinary, GCS, …) MUST expose the same surface
 * so services and repositories never know which provider is active.
 */
export default class StorageInterface {
    /** Presigned URL clients use to GET / read a private object. */
    async getReadUrl(key, expiresInSeconds) { throw new Error("getReadUrl() not implemented"); }

    /** Presigned URL clients use to PUT / upload an object directly. */
    async getWriteUrl(key, contentType, expiresInSeconds) { throw new Error("getWriteUrl() not implemented"); }

    /** Stable public URL (CDN) for an object — may be unsigned. */
    getPublicUrl(key) { throw new Error("getPublicUrl() not implemented"); }

    /** Signed URL for streaming (CloudFront signed cookie / signed URL). */
    getSignedStreamUrl(key, expiresInSeconds) { throw new Error("getSignedStreamUrl() not implemented"); }

    /** Delete an object permanently. */
    async delete(key) { throw new Error("delete() not implemented"); }

    /** Extract the storage key from a stored URL (best-effort). */
    getKeyFromUrl(url) { throw new Error("getKeyFromUrl() not implemented"); }

    /** One-time bucket/CORS / bootstrap setup (idempotent). */
    async setupCors() { /* optional — default no-op */ }
}
