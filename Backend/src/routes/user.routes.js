import { Router } from "express";
import { getOtherUserProfile, getProfile, updateProfile, getHistory, getRecentlyPlayed } from "../controllers/users.controller";

const userRouter = Router()

userRouter.get('/me', getProfile)
userRouter.patch('/me', updateProfile)
userRouter.get('/:id', getOtherUserProfile)
userRouter.get('/me/history', getHistory)
userRouter.get('/me/recently-played', getRecentlyPlayed)


export default userRouter