import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient({
  log: ["warn", "error"], // Optional: reduces noise
});

async function main() {
  console.log("🌱 Seeding database with 10,000 products...");

  const products = [];

  for (let i = 0; i < 10000; i++) {
    products.push({
      name: faker.commerce.productName(),
      price: faker.commerce.price({ min: 1, max: 1000, dec: 2 }),
      description: faker.commerce.productDescription(),
    });

    // Batch insert every 1000 products to avoid memory issues
    if (products.length === 1000) {
      await prisma.product.createMany({
        data: products,
      });
      console.log(`✅ Inserted ${i + 1000} products`);
      products.length = 0; // Clear the array
    }
  }

  // Insert remaining products
  if (products.length > 0) {
    await prisma.product.createMany({
      data: products,
    });
    console.log(`✅ Inserted remaining ${products.length} products`);
  }

  console.log("🎉 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
