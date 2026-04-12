import { Router } from "express";
import { getOtherUserProfile, getProfile, updateProfile, getHistory, getRecentlyPlayed } from "../controllers/users.controller.js";
import isAuthenticated from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.js";

const userRouter = Router()

userRouter.get('/my-profile', isAuthenticated, getProfile)
userRouter.patch('/my-profile', isAuthenticated ,upload.single("profile") , updateProfile)
userRouter.get('/:id', getOtherUserProfile)
userRouter.get('/me/history', getHistory)
userRouter.get('/me/recently-played', getRecentlyPlayed)


export default userRouter