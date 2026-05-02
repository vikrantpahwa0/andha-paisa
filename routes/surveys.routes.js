import express from "express";
import {
  createUpdateSurveys,
  listSurveys,
  listUserSurveys
} from "../controllers/surveys.controller.js";
import { authMiddleware } from "../middlewares/permissions.js";
import { roles } from "../constants/codes.js";

const router = express.Router();

router.post("/create-update", authMiddleware(roles.ADMIN), createUpdateSurveys);
router.get("/list", authMiddleware(roles.ADMIN), listSurveys);

// router.post("/submit-user-survey", authMiddleware(roles.USER), submitUserSurvey);
router.get("/list-user-surveys", authMiddleware(roles.USER), listUserSurveys);

export default router;
