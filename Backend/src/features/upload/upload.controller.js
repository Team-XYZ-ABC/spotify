import asyncHandler from "../../core/http/async-handler.js";
import response from "../../core/http/api-response.js";
import uploadService from "./upload.service.js";

export const getPresignedUrl = asyncHandler(async (req, res) => {
    const data = await uploadService.createUploadUrl(req.body, req.user.id);
    return response.ok(res, { message: "Presigned URL generated", ...data });
});
