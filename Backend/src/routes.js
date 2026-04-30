import { Router } from "express";
import authRouter from "./features/auth/auth.routes.js";
import userRouter from "./features/user/user.routes.js";
import artistRouter from "./features/artist/artist.routes.js";
import trackRouter from "./features/track/track.routes.js";
import albumRouter from "./features/album/album.routes.js";
import playlistRouter from "./features/playlist/playlist.routes.js";
import followRouter from "./features/follow/follow.routes.js";
import libraryRouter from "./features/library/library.routes.js";
import searchRouter from "./features/search/search.routes.js";
import playerRouter from "./features/player/player.routes.js";
import recommendationRouter from "./features/recommendation/recommendation.routes.js";
import uploadRouter from "./features/upload/upload.routes.js";
import adminRouter from "./features/admin/admin.routes.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/upload", uploadRouter);
router.use("/users", userRouter);
router.use("/artists", artistRouter);
router.use("/tracks", trackRouter);
router.use("/albums", albumRouter);
router.use("/playlists", playlistRouter);
router.use("/follow", followRouter);
router.use("/library", libraryRouter);
router.use("/search", searchRouter);
router.use("/player", playerRouter);
router.use("/recommendations", recommendationRouter);
router.use("/admin", adminRouter);

export default router;
