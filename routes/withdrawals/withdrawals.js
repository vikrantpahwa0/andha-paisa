import express from "express";
import {
  createWithdrawal,
  listWithdrawalRequests
} from "../../controllers/withdrawals/withdrawals.controller.js";
import { authMiddleware } from "../../middlewares/permissions.js";
import { roles } from "../../constants/codes.js";

const router = express.Router();

router.post("/add", authMiddleware(roles.USER), createWithdrawal);
router.get("/list", authMiddleware(roles.USER), listWithdrawalRequests);


export default router;
