import express from "express";
import {
  login,
  signup,
  logout,
  updateProfile,
  checkAuth,
} from "../controllers/authControllers.js";
import { protectRoute } from "../middleware/authMiddleware.js";
import { sendOTP, verifyOTP } from "../Utils/index.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/logout", logout);

router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

router.put("/updateProfile", protectRoute, updateProfile);
router.get("/check", protectRoute, checkAuth);

export default router;