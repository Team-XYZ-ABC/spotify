import mongoose from "mongoose";
import config from "./src/config.js";

const uri = config.db.uri;

async function check() {
    if (!uri) {
        console.error("Error: MONGO_URI environment variable is not defined in the environment or .env file.");
        process.exit(1);
    }
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(uri);
        console.log("Connected successfully!");

        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("Collections:", collections.map(c => c.name));

        const userCount = await mongoose.connection.db.collection("users").countDocuments();
        const artistCount = await mongoose.connection.db.collection("artists").countDocuments();
        const trackCount = await mongoose.connection.db.collection("tracks").countDocuments();
        const albumCount = await mongoose.connection.db.collection("albums").countDocuments();

        console.log(`\nDatabase Stats:`);
        console.log(`- Users: ${userCount}`);
        console.log(`- Artists: ${artistCount}`);
        console.log(`- Tracks: ${trackCount}`);
        console.log(`- Albums: ${albumCount}`);

        if (trackCount > 0) {
            console.log("\nSample Tracks:");
            const samples = await mongoose.connection.db.collection("tracks").find().limit(3).toArray();
            console.log(JSON.stringify(samples, null, 2));
        } else {
            console.log("\nWARNING: No tracks found in the 'tracks' collection!");
        }

        await mongoose.disconnect();
        console.log("Disconnected from MongoDB.");
    } catch (err) {
        console.error("Error checking database:", err);
    }
}

check();
