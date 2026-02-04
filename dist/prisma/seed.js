var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
const prisma = new PrismaClient({
    log: ["warn", "error"], // Optional: reduces noise
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
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
                yield prisma.product.createMany({
                    data: products,
                });
                console.log(`✅ Inserted ${i + 1000} products`);
                products.length = 0; // Clear the array
            }
        }
        // Insert remaining products
        if (products.length > 0) {
            yield prisma.product.createMany({
                data: products,
            });
            console.log(`✅ Inserted remaining ${products.length} products`);
        }
        console.log("🎉 Database seeded successfully!");
    });
}
main()
    .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
