import { Cache } from "../../src/middlewares/cache.js";
import { redisClient } from "../../src/config/redis.js";

// Mock the Redis client
jest.mock("../../src/config/redis.js", () => ({
  redisClient: {
    GET: jest.fn(),
    SET: jest.fn(),
  },
}));

describe("Cache Middleware", () => {
  let cacheCheck: ReturnType<typeof Cache>["cacheCheck"];

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    cacheCheck = Cache().cacheCheck;
  });

  describe("cacheCheck", () => {
    it("should return cached data when key exists in Redis", async () => {
      const mockData = { id: 1, name: "Test Product", price: "99.99" };
      (redisClient.GET as jest.Mock).mockResolvedValue(JSON.stringify(mockData));

      const result = await cacheCheck("1");

      expect(result).toEqual({
        success: true,
        data: mockData,
      });
      expect(redisClient.GET).toHaveBeenCalledWith("Product:1");
    });

    it("should return cache miss when key does not exist", async () => {
      (redisClient.GET as jest.Mock).mockResolvedValue(null);

      const result = await cacheCheck("999");

      expect(result).toEqual({
        success: false,
        error: "Cache not found!",
      });
    });

    it("should handle Redis errors gracefully", async () => {
      (redisClient.GET as jest.Mock).mockRejectedValue(new Error("Redis connection failed"));

      const result = await cacheCheck("1");

      expect(result).toEqual({
        success: false,
        error: "Cache not found!",
      });
    });

    it("should handle invalid JSON in cache gracefully", async () => {
      (redisClient.GET as jest.Mock).mockResolvedValue("invalid json");

      const result = await cacheCheck("1");

      // The cache middleware catches JSON parse errors and returns a graceful error
      expect(result).toEqual({
        success: false,
        error: "Cache not found!",
      });
    });
  });
});
