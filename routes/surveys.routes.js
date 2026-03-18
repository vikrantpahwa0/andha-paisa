import express from "express";
import { getSurveys } from "../controllers/surveys.controller.js";

const router = express.Router();

router.get("/", getSurveys);

export default router;
