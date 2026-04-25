import { Router } from "express";
import uploadRouter from "./upload.routes.js";
import userRouter from "./user.routes.js";
import authRouter from "./auth.routes.js";
import artistRouter from "./artist.routes.js";
import trackRouter from "./track.routes.js";
import albumRouter from "./album.routes.js";
import playlistRouter from "./playlist.routes.js";
import followRouter from "./follow.routes.js";
import libraryRouter from "./library.routes.js";
import searchRouter from "./search.routes.js";
import playerRouter from "./player.routes.js";
import recommendationRouter from "./recommendation.routes.js";
import adminRouter from "./admin.routes.js";

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

// http://localhost:3000/api/v1/recommendations