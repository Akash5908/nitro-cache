import express from "express";
import { PrismaClient } from "@prisma/client"; // ✅ Fixed import
import { Cache } from "../middlewares/cache.js";
import { redisClient } from "../config/redis.js";

const router: express.Router = express.Router();
const prisma = new PrismaClient();
const { cacheCheck } = Cache();

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
}

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  // Check the cache first
  const cache = await cacheCheck(id);
  console.log(cache);
  if (cache?.success === true) {
    return res.json({
      success: true,
      product: cache.data,
    });
  }
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    // Add the product in cache
    redisClient.SET(`Product:${id}`, JSON.stringify(product));

    // Delay of 2 sec
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, price, description } = req.body;
  try {
    const update = await prisma.product.update({
      where: {
        id: Number(id),
      },
      data: {
        name: name,
        price: price,
        description: description,
      },
    });
    if (!update) {
      return res.status(404).json({
        success: false,
        error: "Product not found.",
      });
    }

    // Update the cache
    redisClient.SET(`Product:${id}`, JSON.stringify(update));

    await new Promise((resolve) => setTimeout(resolve, 2000));
    return res.status(200).json({
      success: true,
      message: "Successfully updated the product.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
});

export { router as ProductRouter };
