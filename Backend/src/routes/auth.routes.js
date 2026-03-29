import { Router } from "express";
import { getCurrentUser, loginUser, logoutUser, registerUser, isEmailExist } from "../controllers/auth.controller.js";

const authRouter = Router()

authRouter.post('/email-exists', isEmailExist)
authRouter.post('/register', registerUser)
authRouter.post('/login', loginUser)
authRouter.post('/logout', logoutUser)
authRouter.get('/me', getCurrentUser)

export default authRouter