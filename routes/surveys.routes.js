import express from "express";
import {
  createUpdateSurveys,
  listSurveys,
} from "../controllers/surveys.controller.js";

const router = express.Router();

router.post("/create-update", createUpdateSurveys);
router.get("/list", listSurveys);

export default router;
