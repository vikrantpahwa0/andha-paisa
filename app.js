import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import db from "./database/index.js";
import surveyRoutes from "./routes/surveys.routes.js";
import userRoutes from "./routes/users.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/surveys", surveyRoutes);
app.use("/auth", userRoutes);

const PORT = process.env.PORT || 3000;

db.sequelize.sync().then(async () => {
  console.log("Database connected");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
