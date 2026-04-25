import { randomUUID } from "crypto";
import path from "path";
import { getPresignedUploadUrl } from "../services/s3.service.js";

/**
 * POST /api/v1/upload/presigned-url
 * Body: { fileName, contentType, folder }
 *   folder: "audio" | "covers" | "profiles"  (default: "misc")
 *
 * Returns: { uploadUrl, key }
 *   uploadUrl  - S3 presigned PUT URL (valid 5 min) — frontend uploads directly
 *   key        - S3 object key to send back when creating/updating a resource
 */
export const getPresignedUrl = async (req, res) => {
    try {
        const { fileName, contentType, folder = "misc" } = req.body;

        if (!fileName || !contentType) {
            return res.status(400).json({
                message: "fileName and contentType are required",
            });
        }

        const ext = path.extname(fileName);
        const key = `${folder}/${req.user.id}/${randomUUID()}${ext}`;

        const uploadUrl = await getPresignedUploadUrl(key, contentType);

        res.status(200).json({ uploadUrl, key });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
