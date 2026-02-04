// index.ts (or server.ts)
import express from "express";
import { redisServer } from "./src/config/redis.js";
import { ProductRouter } from "./src/controllers/product.js";

const app = express();
app.use(express.json());

app.use("/api/products", ProductRouter);

// Redis connection
redisServer();

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
