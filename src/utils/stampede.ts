import { PrismaClient } from "@prisma/client";

const cache = new Map();

const prisma = new PrismaClient();

export const PromiseMemorization = async (id: string) => {
  if (cache.has(id)) {
    return cache.get(id);
  }

  const promise = await prisma.product
    .findUnique({
      where: { id: Number(id) },
    })
    .then((data) => {
      cache.delete(id);
      return data;
    })
    .catch((error) => {
      cache.delete(id);
      return error;
    });

  cache.set(id, promise);
  return promise;
};
