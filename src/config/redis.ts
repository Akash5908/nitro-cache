import { createClient } from "redis";

const redisClient = createClient({
  socket: {
    reconnectStrategy: (retries: number) => {
      if (retries > 10) {
        console.log("Max retries exceeded");
        return new Error("Max retries exceeded");
      }
      const delay = Math.min(100 * retries, 3000); // 100ms → 3s backoff
      console.log(`Retrying in ${delay}ms... (attempt ${retries})`);
      return delay;
    },
  },
});

redisClient.on("connect", () => console.log("✅ Connected to Redis"));
redisClient.on("error", (err) => console.error("❌ Redis error:", err));

export { redisClient };
