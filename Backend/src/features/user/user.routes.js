import { Router } from "express";
import {
    getOtherUserProfile,
    getProfile,
    updateProfile,
    getHistory,
    getRecentlyPlayed,
} from "./user.controller.js";
import isAuthenticated from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/my-profile", isAuthenticated, getProfile);
router.patch("/my-profile", isAuthenticated, updateProfile);
router.get("/me/history", getHistory);
router.get("/me/recently-played", getRecentlyPlayed);
router.get("/:id", getOtherUserProfile);

export default router;
