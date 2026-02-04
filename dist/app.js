import { ProductRouter } from "./src/controllers/product.js";
import { app } from "./server.js";
app.use("/product", ProductRouter);
console.log("first");
