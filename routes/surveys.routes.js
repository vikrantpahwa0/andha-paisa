import express from "express";
import {
  createUpdateSurveys,
  listSurveys,
} from "../controllers/surveys.controller.js";
import { authMiddleware } from "../middlewares/permissions.js";
import { roles } from "../constants/codes.js";

const router = express.Router();

router.post("/create-update", authMiddleware(roles.ADMIN), createUpdateSurveys);
router.get("/list", authMiddleware(roles.ADMIN), listSurveys);

// router.get("/list", authMiddleware(roles.USER), listSurveys);
// router.get("/submit-user-survey", authMiddleware(roles.USER), listSurveys);



export default router;
