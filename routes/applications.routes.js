import express from "express";
import {
  sendApplication,
  fetchApplications,
  fetchApplicationById,
  toggleFollowUp,
} from "../controllers/applications.controller.js";

const router = express.Router();

router.post("/send", sendApplication);
router.get("/", fetchApplications);
router.get("/:id", fetchApplicationById);
router.patch("/:id/toggle-follow-up", toggleFollowUp);

export default router;
