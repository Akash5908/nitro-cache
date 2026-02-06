import { PrismaClient } from "@prisma/client";

const cache = new Map();

const prisma = new PrismaClient();

export const PromiseMemorization = async (id: string) => {
  try {
    if (cache.has(id)) {
      return cache.get(id);
    }

    const promise = prisma.product.findUnique({
      where: { id: Number(id) },
    });

    // Store the promise immediately
    cache.set(id, promise);

    // Clean up cache after promise resolves/rejects
    promise.finally(() => {
      cache.delete(id);
    });

    return promise;
  } catch (error) {
    console.log("Promise memorization failed", error);
  }
};
