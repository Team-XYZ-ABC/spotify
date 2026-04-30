import { randomUUID } from "crypto";
import path from "path";
import { getWriteUrl } from "../../lib/storage.js";
import { URL_TTL } from "../../constants.js";

const createUploadUrl = async ({ fileName, contentType, folder }, userId) => {
    const ext = path.extname(fileName);
    const key = `${folder}/${userId}/${randomUUID()}${ext}`;
    const uploadUrl = await getWriteUrl(key, contentType, URL_TTL.FIVE_MINUTES);
    return { uploadUrl, key };
};

export default { createUploadUrl };
