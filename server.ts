// import { redisClient } from "./src/config/redis.ts";
import app from "./app.js";
import { redisClient } from "./src/config/redis.js";

const PORT = process.env.PORT || 5001;

const Server = async () => {
  // Redis connection
  try {
    await redisClient.connect(); // ← FAILS HERE, but no error visible
  } catch (error) {
    console.error("❌ Redis FAILED:", error); // ← ADD THIS
  }
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

Server();
