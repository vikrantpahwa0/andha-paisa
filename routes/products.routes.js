import express from "express";
import {
  createUpdateProducts,
  listProducts,
  listCategories,
} from "../controllers/products.controller.js";
import { authMiddleware } from "../middlewares/permissions.js";
import { roles } from "../constants/codes.js";

const router = express.Router();

// Survey Admin Routes
router.post(
  "/create-update",
  authMiddleware(roles.ADMIN),
  createUpdateProducts,
);
router.get("/list", authMiddleware(roles.ADMIN), listProducts);
router.get("/categories/list", listCategories);

export default router;
