import { Router } from "express";
import {
    getCurrentUser,
    loginUser,
    logoutUser,
    registerUser,
    isEmailExist,
} from "./auth.controller.js";
import validate from "../../middlewares/validate.middleware.js";
import {
    emailExistsSchema,
    loginSchema,
    registerSchema,
} from "./auth.validation.js";

const router = Router();

router.post("/email-exists", validate(emailExistsSchema), isEmailExist);
router.post("/register", validate(registerSchema), registerUser);
router.post("/login", validate(loginSchema), loginUser);
router.post("/logout", logoutUser);
router.get("/me", getCurrentUser);

export default router;
