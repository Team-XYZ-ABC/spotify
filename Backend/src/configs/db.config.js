import mongoose from "mongoose";
import config from "./env.config.js";

const connectDB = async()=>{
    try{
        await mongoose.connect(config.MONGO_URI)
        console.log("DB connected")
    }catch(err){
        console.log(err)
    }
}
export default connectDB