import { Router } from "express";
import { getOtherUserProfile, getProfile, updateProfile, getHistory, getRecentlyPlayed } from "../controllers/users.controller.js";
import isAuthenticated from "../middlewares/auth.middleware.js";

const userRouter = Router()

userRouter.get('/me', isAuthenticated, getProfile)
userRouter.patch('/me', isAuthenticated , updateProfile)
userRouter.get('/:id', getOtherUserProfile)
userRouter.get('/me/history', getHistory)
userRouter.get('/me/recently-played', getRecentlyPlayed)


export default userRouter