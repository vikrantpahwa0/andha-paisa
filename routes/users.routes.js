import express from "express";
import {
  registerUser,
  loginUser,
  sendOtp,
  verifyOtp,
} from "../controllers/users.controller.js";

const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

export default router;
