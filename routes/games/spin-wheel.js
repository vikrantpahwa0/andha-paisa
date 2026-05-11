import express from "express";
import { spinWheel, getSpinCount } from "../../controllers/games/spin-wheel.js";
import { authMiddleware } from "../../middlewares/permissions.js";
import { roles } from "../../constants/codes.js";

const router = express.Router();

router.post("/spin", authMiddleware(roles.USER), spinWheel);
router.get("/spin-count", authMiddleware(roles.USER), getSpinCount);


export default router;
