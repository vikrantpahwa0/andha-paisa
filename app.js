import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import db from "./database/index.js";
import surveyRoutes from "./routes/surveys.routes.js";
import userRoutes from "./routes/users.routes.js";
import miniGamesRoutes from "./routes/games/spin-wheel.js";
import approvalRoutes from "./routes/approvals.js";
import withdrawalsRoutes from "./routes/withdrawals/withdrawals.js";
import productRoutes from "./routes/products.routes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());

// Increase payload size limit BEFORE any routes
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Serve static files from "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Ensure the user profile pictures directory exists
const uploadDir = path.join(__dirname, "public", "user-profile-pictures");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use("/surveys", surveyRoutes);
app.use("/auth", userRoutes);
app.use("/mini-games", miniGamesRoutes);
app.use("/admin/approvals", approvalRoutes);
app.use("/withdrawals", withdrawalsRoutes);
app.use("/products", productRoutes);

const PORT = process.env.PORT || 3000;

db.sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  });
