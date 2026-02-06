import z from "zod";

export const ProductValidator = z.object({
  name: z.string(),
  description: z.string(),
  price: z.string(),
});
