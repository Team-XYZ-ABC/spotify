import { Router } from "express";
import { getPresignedUrl } from "../controllers/upload.controller.js";
import isAuthenticated from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { presignedUrlSchema } from "../validators.js";

const uploadRouter = Router();

uploadRouter.post("/presigned-url", isAuthenticated, validate(presignedUrlSchema), getPresignedUrl);

export default uploadRouter;
