import { Router } from "express";
import {userRegisterUser, userLoginUser, userLogout, artistRegisterUser, artistLoginUser, artistLogout} from '../controllers/auth.controller.js'

const authRouter = Router()

authRouter.post('/users/register', userRegisterUser)
authRouter.post('/users/login', userLoginUser)
authRouter.post('/users/logout', userLogout)

authRouter.post('/artists/register', artistRegisterUser)
authRouter.post('/artists/login', artistLoginUser)
authRouter.post('/artists/logout', artistLogout)



export default authRouter