import { Router } from "express";
import {registerUser, loginUser, logout} from '../controllers/Authentication.controller.js'

const authRouter = Router()

authRouter.post('/register', registerUser)
authRouter.post('/login', loginUser)
authRouter.get('/logout', logout)

export default authRouter