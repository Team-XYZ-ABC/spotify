import app from "./src/app.js";
import config from "./src/config.js";
import { connectDatabase } from "./src/lib/db.js";
import { setupCors } from "./src/lib/storage.js";

const start = async () => {
    await connectDatabase();
    setupCors().catch((err) =>
        console.warn("[server] storage CORS setup failed:", err.message)
    );

    app.listen(config.port, () => {
        console.log(`[server] running on port ${config.port}`);
    });
};

start().catch((err) => {
    console.error("[server] failed to start:", err.message, err.stack);
    process.exit(1);
});
