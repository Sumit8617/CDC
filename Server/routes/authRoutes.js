import express from "express";
import rateLimit from "express-rate-limit";
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

// Signup rate limit
const signupLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many signup attempts from this IP, please try again later.",
  },
  standardHeaders: true, 
  legacyHeaders: false,
});

router.post("/login", login);
router.post("/signup", signupLimiter, signup);
router.post("/logout", logout);

router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

router.put("/updateProfile", protectRoute, updateProfile);
router.get("/check", protectRoute, checkAuth);

export default router;
