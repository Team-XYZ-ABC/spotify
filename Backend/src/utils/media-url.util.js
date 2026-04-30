import { storage } from "../core/storage/index.js";
import { URL_TTL } from "../core/constants/index.js";

/**
 * Resolve a stored object's display URL (presigned GET).
 *
 *   - prefers explicit `key` field if present (e.g. avatarKey, coverImageKey)
 *   - falls back to extracting key from a stored CDN URL
 *   - returns the original URL on any failure (never throws)
 */
export const signObjectUrl = async (key, fallbackUrl, expiresIn = URL_TTL.ONE_DAY) => {
    const resolvedKey = key || storage.getKeyFromUrl(fallbackUrl);
    if (!resolvedKey) return fallbackUrl || null;
    try {
        return await storage.getReadUrl(resolvedKey, expiresIn);
    } catch {
        return fallbackUrl || null;
    }
};

/**
 * Replace a list of objects' image fields in-place with signed URLs.
 *
 *   await signImages(items, { keyField: 'coverImageKey', urlField: 'coverImage' });
 */
export const signImages = async (
    items,
    { keyField = "coverImageKey", urlField = "coverImage", expiresIn = URL_TTL.ONE_DAY } = {}
) =>
    Promise.all(
        items.map(async (item) => {
            const obj = item?.toObject ? item.toObject() : { ...item };
            obj[urlField] = await signObjectUrl(obj[keyField], obj[urlField], expiresIn);
            return obj;
        })
    );

/**
 * Build a stable public URL for a freshly-uploaded object (e.g. saving to DB).
 */
export const publicUrl = (key) => storage.getPublicUrl(key);
