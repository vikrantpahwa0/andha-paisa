import express from "express";
import {
  sendApplication,
  fetchApplications,
  fetchApplicationById,
} from "../controllers/applications.controller.js";

const router = express.Router();

router.post("/send", sendApplication);
router.get("/", fetchApplications);
router.get("/:id", fetchApplicationById);

export default router;
