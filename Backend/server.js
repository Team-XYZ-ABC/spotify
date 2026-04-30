import app from "./src/app.js";
import config from "./src/config/index.js";
import { connectDatabase } from "./src/core/database/index.js";
import { storage } from "./src/core/storage/index.js";
import logger from "./src/core/logger/logger.js";

const log = logger.child("server");

const start = async () => {
    await connectDatabase();
    storage.setupCors().catch((err) =>
        log.warn("Storage CORS setup failed", { msg: err.message })
    );

    app.listen(config.app.port, () => {
        log.info(`Server running on port ${config.app.port}`);
    });
};

start().catch((err) => {
    log.error("Failed to start server", { msg: err.message, stack: err.stack });
    process.exit(1);
});
