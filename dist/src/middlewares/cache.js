var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { redisClient } from "../config/redis.js";
export const Cache = () => {
    const cacheCheck = (key) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const res = yield redisClient.GET(`Product:${key}`);
            if (!res) {
                return {
                    success: false,
                    error: "Cache not found!",
                };
            }
            return { success: true, data: JSON.parse(res) };
        }
        catch (error) {
            console.log(error);
            return {
                success: false,
                error: "Cache not found!",
            };
        }
    });
    return { cacheCheck };
};
