import { createClient } from "redis";

const redisClient = createClient();

const redisServer = async () => {
  try {
    await redisClient.connect();
    console.log("Connected to redis.");
  } catch (error) {
    console.log("Failed to connect to redis");
  }
};

export { redisServer, redisClient };
