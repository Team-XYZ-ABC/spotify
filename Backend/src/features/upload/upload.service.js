import { randomUUID } from "crypto";
import path from "path";
import { storage } from "../../core/storage/index.js";
import { URL_TTL } from "../../core/constants/index.js";

class UploadService {
    async createUploadUrl({ fileName, contentType, folder }, userId) {
        const ext = path.extname(fileName);
        const key = `${folder}/${userId}/${randomUUID()}${ext}`;
        const uploadUrl = await storage.getWriteUrl(key, contentType, URL_TTL.FIVE_MINUTES);
        return { uploadUrl, key };
    }
}

export default new UploadService();
