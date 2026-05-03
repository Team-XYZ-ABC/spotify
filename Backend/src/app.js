import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import config from "./config.js";
import routes from "./routes.js";
import { globalErrorHandler, notFoundHandler } from "./lib/error-handler.js";

const app = express();

app.use(cors({ origin: config.clientOrigin, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

app.use(config.apiPrefix, routes);

app.get("/health", (req, res) =>
    res.json({ status: "ok", timestamp: new Date().toISOString() })
);

app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
