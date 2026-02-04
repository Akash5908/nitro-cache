import { redisClient } from "../config/redis.js";

export const Cache = () => {
  const cacheCheck = async (key: string) => {
    try {
      const res = await redisClient.GET(`Product:${key}`);
      if (!res) {
        return {
          success: false,
          error: "Cache not found!",
        };
      }
      return { success: true, data: JSON.parse(res!) };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error: "Cache not found!",
      };
    }
  };
  return { cacheCheck };
};
