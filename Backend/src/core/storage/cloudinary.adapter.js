import StorageInterface from "./storage.interface.js";

/**
 * CloudinaryAdapter — placeholder.
 *
 * Implement via `cloudinary` SDK when needed. The point: storage consumers
 * need NOT change when this becomes the active driver.
 */
export default class CloudinaryAdapter extends StorageInterface {
    constructor() {
        super();
        throw new Error("CloudinaryAdapter not implemented yet.");
    }
}
