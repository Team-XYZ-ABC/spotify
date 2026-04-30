import mongoose from "mongoose";
import config from "../config.js";

export const connectDatabase = async () => {
    if (!config.db.uri) throw new Error("MONGO_URI is missing");
    const conn = await mongoose.connect(config.db.uri);
    console.log(`[db] connected: ${conn.connection.host}`);
    return conn;
};
