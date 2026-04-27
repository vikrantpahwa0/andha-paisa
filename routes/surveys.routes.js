import express from "express";
import { createUpdateSurveys } from "../controllers/surveys.controller.js";

const router = express.Router();

router.post("/create-update", createUpdateSurveys);

export default router;
