import express from "express";
import {
  createWithdrawal,
  listWithdrawalRequests,
  listAllWithdrawalRequests,
  updateWithdrawalStatus
} from "../../controllers/withdrawals/withdrawals.controller.js";
import { authMiddleware } from "../../middlewares/permissions.js";
import { roles } from "../../constants/codes.js";

const router = express.Router();

router.post("/add", authMiddleware(roles.USER), createWithdrawal);
router.get("/list", authMiddleware(roles.USER), listWithdrawalRequests);

router.get("/admin/list", authMiddleware(roles.ADMIN), listAllWithdrawalRequests);
router.post("/admin/update-status", authMiddleware(roles.ADMIN), updateWithdrawalStatus);



export default router;
