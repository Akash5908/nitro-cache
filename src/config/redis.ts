import { createClient } from "redis";

const redisClient = createClient({
  url: "redis://localhost:6379",
  socket: {
    reconnectStrategy: (retries: number) => {
      if (retries > 10) {
        console.log("Max retries exceeded");
        return false;
      }
      const jitter = Math.floor(Math.random() * 100);
      const delay = Math.min(100 * retries, 3000); // 100ms → 3s backoff
      console.log(`Retrying in ${delay + jitter}ms... (attempt ${retries})`);
      return delay + jitter;
    },
  },
  disableOfflineQueue: true,
});

redisClient.on("ready", () => console.log("✅ Connected to Redis"));
redisClient.on("error", (err) => console.error("❌ Redis error:", err));
redisClient.on("reconnecting", () => console.error("🔄 Reconnecting..."));

export { redisClient };
