import express from "express";
import {
  createUpdateSurveys,
  listSurveys,
} from "../controllers/products.controller.js";
import { authMiddleware } from "../middlewares/permissions.js";
import { roles } from "../constants/codes.js";

const router = express.Router();

// Survey Admin Routes 
router.post("/create-update", createUpdateSurveys);
router.get("/list",  listSurveys);


export default router;
