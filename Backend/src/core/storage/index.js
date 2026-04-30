import config from "../../config/index.js";
import S3Adapter from "./s3.adapter.js";
import CloudinaryAdapter from "./cloudinary.adapter.js";

const drivers = {
    s3: () => new S3Adapter(config.storage.s3),
    cloudinary: () => new CloudinaryAdapter(config.storage.cloudinary),
};

const factory = drivers[config.storage.driver];
if (!factory) {
    throw new Error(`Unknown storage.driver: "${config.storage.driver}"`);
}

/**
 * Singleton storage adapter — services import this directly.
 * Swap providers by changing `config.storage.driver`.
 */
export const storage = factory();
