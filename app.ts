import express from "express";
import { rateLimit } from "express-rate-limit";
import { ProductRouter } from "./src/controllers/product.js";
import cors from "cors";

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
});

const app = express();

const allowedOrigins = [
  // "http://localhost:5173",
  "https://nitro-cache.onrender.com",
  "https://nitro-cache.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`Blocked CORS from: ${origin}`); // Log for debugging
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Add OPTIONS explicitly
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.set("trust proxy", 1);
app.use(express.json());
app.use(limiter);
app.use("/api/products", ProductRouter);

export default app;
