import { PrismaClient } from "@prisma/client";

const cache = new Map();

const prisma = new PrismaClient();

export const PromiseMemorization = async (id: string) => {
  if (cache.has(id)) {
    return cache.get(id);
  }

  const data = await prisma.product.findUnique({
    where: { id: Number(id) },
  });

  cache.set(id, data);
  return data;
};
