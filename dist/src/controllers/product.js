var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import { PrismaClient } from "@prisma/client"; // ✅ Fixed import
import { Cache } from "../middlewares/cache.js";
import { redisClient } from "../config/redis.js";
const router = express.Router();
const prisma = new PrismaClient();
const { cacheCheck } = Cache();
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // Check the cache first
    const cache = yield cacheCheck(id);
    console.log(cache);
    if ((cache === null || cache === void 0 ? void 0 : cache.success) === true) {
        return res.json({
            success: true,
            product: cache.data,
        });
    }
    try {
        const product = yield prisma.product.findUnique({
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
        yield new Promise((resolve) => setTimeout(resolve, 2000));
        return res.status(200).json({
            success: true,
            product,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: "Server error",
        });
    }
}));
router.patch("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, price, description } = req.body;
    try {
        const update = yield prisma.product.update({
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
        yield new Promise((resolve) => setTimeout(resolve, 2000));
        return res.status(200).json({
            success: true,
            message: "Successfully updated the product.",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error.",
        });
    }
}));
export { router as ProductRouter };
