import { Router } from "express";
import { getPresignedUrl } from "./upload.controller.js";
import isAuthenticated from "../../middlewares/auth.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { presignedUrlSchema } from "./upload.validation.js";

const router = Router();

router.post(
    "/presigned-url",
    isAuthenticated,
    validate(presignedUrlSchema),
    getPresignedUrl
);

export default router;
