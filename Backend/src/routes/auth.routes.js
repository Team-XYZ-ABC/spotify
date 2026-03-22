import { Router } from "express";
import { GetCurrentUser, loginUser, logoutUser, registerUser } from "../controllers/auth.controller.js";

const authRouter = Router()

authRouter.post('/register', registerUser)
authRouter.post('/login', loginUser)
authRouter.post('/logout', logoutUser)
authRouter.get('/me', GetCurrentUser)

export default authRouter