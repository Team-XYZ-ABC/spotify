import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import indexRouter from "./routes/index.route.js";
import config from "./config/index.js";
import { globalErrorHandler, notFoundHandler } from "./core/http/error-handler.js";

const app = express();

app.use(
    cors({
        origin: config.app.clientOrigin,
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

app.use(config.app.apiPrefix, indexRouter);

// Health check
app.get("/health", (req, res) =>
    res.json({ status: "ok", timestamp: new Date().toISOString() })
);

// 404 + global error handlers (must be last)
app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
