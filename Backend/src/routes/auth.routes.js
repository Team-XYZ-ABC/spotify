import { Router } from "express";
import { GetCurrentUser, loginUser, logoutUser, registerUser } from "../controllers/auth.controller.js";

const authRouter = Router()

authRouter.post('/users/register', registerUser)
authRouter.post('/users/login', loginUser)
authRouter.post('/users/logout', logoutUser)
authRouter.get('/users/profile', GetCurrentUser)

export default authRouter