import express from "express";
import {
  createTemplate,
  fetchTemplates,
  fetchTemplateById,
  updateTemplate,
  deleteTemplate,
} from "../controllers/templates.controller.js";
import { uploadResume } from "../middlewares/upload.js";
// import { authMiddleware } from "../middlewares/permissions.js";
// import { roles } from "../constants/codes.js";

const router = express.Router();

router.post("/", uploadResume, createTemplate);
router.get("/", fetchTemplates);
router.get("/:id", fetchTemplateById);
router.put("/:id", uploadResume, updateTemplate);
router.delete("/:id", deleteTemplate);

// With auth:
// router.use(authMiddleware(roles.USER));
// router.post("/", uploadResume, createTemplate);
// router.get("/", fetchTemplates);
// router.get("/:id", fetchTemplateById);
// router.put("/:id", uploadResume, updateTemplate);
// router.delete("/:id", deleteTemplate);

export default router;
