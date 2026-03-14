import mongoose from "mongoose";
import CONFIG from "./env.config.js";

const connectDB = async()=>{
    try{
        const conn = await mongoose.connect(CONFIG.MONGO_URI)
        console.log(`DB CONNECTED ON HOST: ${conn.connection.host}`);
    }catch(err){
        console.log(err.message)
    }
}
export default connectDB