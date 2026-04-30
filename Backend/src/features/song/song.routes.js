import { Router } from "express";
import {
    getUploadUrl,
    confirmUpload,
    progressStream,
    getStatus,
    serveHlsMaster,
    serveHlsVariant,
} from "./song.controller.js";
import isAuthenticated from "../../middlewares/auth.middleware.js";
import authRole from "../../middlewares/authRole.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { ROLES } from "../../constants.js";
import { uploadUrlSchema, confirmUploadSchema } from "./song.validation.js";

const router = Router();

router.post(
    "/upload-url",
    isAuthenticated,
    authRole([ROLES.ARTIST]),
    validate(uploadUrlSchema),
    getUploadUrl
);

router.post(
    "/confirm-upload",
    isAuthenticated,
    authRole([ROLES.ARTIST]),
    validate(confirmUploadSchema),
    confirmUpload
);

// SSE — auth-aware via cookie (browser sends cookies on EventSource by default for same-origin / withCredentials)
router.get("/progress/:songId", isAuthenticated, progressStream);

// Polling fallback for browsers / proxies that don't play nice with SSE
router.get("/status/:songId", isAuthenticated, getStatus);

// HLS playlist proxy — rewrites variant/segment paths so CloudFront signed-URL
// restrictions are bypassed: .m3u8 text flows through the backend,
// .ts segments go direct to S3 via short-lived presigned URLs.
router.get("/hls/:trackId/master.m3u8", isAuthenticated, serveHlsMaster);
router.get("/hls/:trackId/:quality.m3u8", isAuthenticated, serveHlsVariant);

export default router;
