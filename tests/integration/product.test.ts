import request from "supertest";

describe("Product API", () => {
  //   ✅ GET test (perfect)
  it("GET /api/products/1 returns product", async () => {
    const response = await request("http://localhost:5001")
      .get("/api/products/1")
      .expect(200)
      .expect("Content-Type", /json/);

    expect(response.body.success).toBe(true);
    expect(response.body.product).toBeDefined();
  });

  // ✅ Fixed POST/PATCH test
  it("updates product", async () => {
    const response = await request("http://localhost:5001")
      .patch("/api/products/1")
      .send({
        name: "Updated Product",
        price: "75000",
        description: "Updated desc",
      })
      .set("Content-Type", "application/json") // ✅ JSON header
      .set("Accept", "application/json")
      .expect(200)
      .expect("Content-Type", /json/);

    expect(response.body.success).toBe(true);
    expect(response.body.success).toBe(true);
  });
});
