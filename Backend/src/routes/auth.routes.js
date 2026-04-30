import { Router } from "express";
import { getCurrentUser, loginUser, logoutUser, registerUser, isEmailExist } from "../controllers/auth.controller.js";
import validate from "../middlewares/validate.middleware.js";
import { emailExistsSchema, loginSchema, registerSchema } from "../validators.js";

const authRouter = Router();

authRouter.post('/email-exists', validate(emailExistsSchema), isEmailExist);
authRouter.post('/register', validate(registerSchema), registerUser);
authRouter.post('/login', validate(loginSchema), loginUser);
authRouter.post('/logout', logoutUser);
authRouter.get('/me', getCurrentUser);

export default authRouter;