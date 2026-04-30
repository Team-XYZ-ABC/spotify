import { Router } from "express";
import authRouter from "../features/auth/auth.routes.js";
import userRouter from "../features/user/user.routes.js";
import artistRouter from "../features/artist/artist.routes.js";
import trackRouter from "../features/track/track.routes.js";
import albumRouter from "../features/album/album.routes.js";
import playlistRouter from "../features/playlist/playlist.routes.js";
import followRouter from "../features/follow/follow.routes.js";
import libraryRouter from "../features/library/library.routes.js";
import searchRouter from "../features/search/search.routes.js";
import playerRouter from "../features/player/player.routes.js";
import recommendationRouter from "../features/recommendation/recommendation.routes.js";
import uploadRouter from "../features/upload/upload.routes.js";
import adminRouter from "../features/admin/admin.routes.js";

const indexRouter = Router();

indexRouter.use("/auth", authRouter);
indexRouter.use("/upload", uploadRouter);
indexRouter.use("/users", userRouter);
indexRouter.use("/artists", artistRouter);
indexRouter.use("/tracks", trackRouter);
indexRouter.use("/albums", albumRouter);
indexRouter.use("/playlists", playlistRouter);
indexRouter.use("/follow", followRouter);
indexRouter.use("/library", libraryRouter);
indexRouter.use("/search", searchRouter);
indexRouter.use("/player", playerRouter);
indexRouter.use("/recommendations", recommendationRouter);
indexRouter.use("/admin", adminRouter);

export default indexRouter;
