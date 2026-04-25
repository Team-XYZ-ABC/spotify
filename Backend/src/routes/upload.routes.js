import { Router } from "express";
import { getPresignedUrl } from "../controllers/upload.controller.js";
import isAuthenticated from "../middlewares/auth.middleware.js";

const uploadRouter = Router();

// Any authenticated user can request a presigned upload URL
uploadRouter.post("/presigned-url", isAuthenticated, getPresignedUrl);

export default uploadRouter;
