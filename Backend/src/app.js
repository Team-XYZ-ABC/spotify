import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import config from "./config.js";
import routes from "./routes.js";
import { globalErrorHandler, notFoundHandler } from "./lib/error-handler.js";

const app = express();

const allowedOrigins = [config.clientOrigin];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        
        const isLocalhost = origin.startsWith("http://localhost:") || 
                            origin.startsWith("http://127.0.0.1:") || 
                            origin === "http://localhost" || 
                            origin === "http://127.0.0.1";

        if (allowedOrigins.includes(origin) || isLocalhost) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
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
