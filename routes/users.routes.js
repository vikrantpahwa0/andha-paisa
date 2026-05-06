import express from "express";
import {
  registerUser,
  loginUser,
  sendOtp,
  verifyOtp,
  fetchUser,
  updateUser,
  refreshAccessToken
} from "../controllers/users.controller.js";
import {authMiddleware} from "../middlewares/permissions.js";
import { roles } from "../constants/codes.js";

const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/refresh", refreshAccessToken);

router.get("/fetchUser", authMiddleware(roles.USER), fetchUser);
router.post("/update-user", authMiddleware(roles.USER), updateUser);



export default router;
