import app from './src/app.js';
import connectDB from './src/configs/db.config.js';
import CONFIG from './src/configs/env.config.js';

connectDB()

app.listen(CONFIG.PORT, ()=>{
    console.log(`SERVER RUNNING ON HOST: ${CONFIG.SERVER_HOST}`)
})