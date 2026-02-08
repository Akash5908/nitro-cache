import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const handleDBInteraction = () => {
  //To handle get db interactions
  const fetchPromise = (id: string) =>
    prisma.product.findUnique({
      where: { id: Number(id) },
    });

  //To handle patch db interactions
  const updateProduct = async (data: {
    id: string;
    name: string;
    price: string;
    description: string;
  }) => {
    try {
      // 1. Check if product exists FIRST
      const existingProduct = await prisma.product.findUnique({
        where: { id: Number(data.id) },
      });

      if (!existingProduct) {
        throw new Error("Product not found!");
      }

      //Update the product if exists
      const product = await prisma.product.update({
        where: {
          id: Number(data.id),
        },
        data: {
          name: data.name,
          price: data.price,
          description: data.description,
        },
      });
      return product;
    } catch (error: any) {
      if (error.code === "P2025") {
        // Prisma "not found" error
        throw new Error("Product not found");
      }
      throw error;
    }
  };
  return { fetchPromise, updateProduct };
};
