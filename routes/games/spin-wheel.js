import express from "express";
import { spinWheel } from "../../controllers/games/spin-wheel.js";
import { authMiddleware } from "../../middlewares/permissions.js";
import { roles } from "../../constants/codes.js";

const router = express.Router();

router.post("/spin", authMiddleware(roles.USER), spinWheel);

export default router;
