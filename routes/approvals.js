import express from "express";
import {
    fetchWithdrawableTransactions
} from "../controllers/approvals.controller.js";
import {authMiddleware} from "../middlewares/permissions.js";
import { roles } from "../constants/codes.js";

const router = express.Router();

router.get("/fetch-withdrawable-transactions", authMiddleware(roles.ADMIN), fetchWithdrawableTransactions);


export default router;
