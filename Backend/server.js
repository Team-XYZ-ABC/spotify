import app from './src/app.js';
import connectDB from './src/configs/db.config.js';
import CONFIG from './src/configs/env.config.js';
import { setupS3Cors } from './src/services/s3.service.js';

connectDB();
setupS3Cors().catch((err) => console.error("[S3] CORS setup failed:", err.message));

app.listen(CONFIG.PORT, () => {
    console.log(`SERVER RUNNING ON HOST: ${CONFIG.SERVER_HOST}`)
})
