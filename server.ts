import app from "./app.js";
import { redisClient } from "./src/config/redis.js";

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    console.log("🔄 Connecting Redis...");
    await redisClient.connect();
    console.log("✅ Redis connected!");

    await app.listen(PORT, () => {
      console.log(`🚀 Starting server on port ${PORT}...`);
    });

    console.log("🎉 Nitro-cache ready!");
  } catch (error) {
    console.error("❌ Startup FAILED:", error);
    process.exit(1); // Exit on failure
  }
};

// ✅ Await the server start
startServer().catch(console.error);
