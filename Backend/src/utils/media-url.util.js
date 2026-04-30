import { getReadUrl, getKeyFromUrl, getPublicUrl } from "../lib/storage.js";
import { URL_TTL } from "../constants.js";

/**
 * Resolve a stored object's display URL (presigned GET).
 * Falls back to extracting the key from a stored URL.
 * Returns the original URL on any failure (never throws).
 */
export const signObjectUrl = async (key, fallbackUrl, expiresIn = URL_TTL.ONE_DAY) => {
    const resolvedKey = key || getKeyFromUrl(fallbackUrl);
    if (!resolvedKey) return fallbackUrl || null;
    try {
        return await getReadUrl(resolvedKey, expiresIn);
    } catch {
        return fallbackUrl || null;
    }
};

/**
 * Replace a list of objects' image fields in-place with signed URLs.
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

export const publicUrl = (key) => getPublicUrl(key);
