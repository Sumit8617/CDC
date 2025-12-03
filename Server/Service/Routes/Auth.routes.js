import express from "express";
import {
  login,
  signup,
  logout,
  checkAuth,
  refreshAccessToken,
  changeCurrentPassword as changePassword,
  userDetails,
} from "../Controllers/Auth.controllers.js";
import { protectRoute } from "../../Middleware/Auth.middleware.js";
import { sendOTP, verifyOTP } from "../../Utils/index.utils.js";
import { updateProfile } from "../../Utils/Common/UpdateProfile.utils.js";
import { upload } from "../../Middleware/Multer.middleware.js";
import {
  resetPassword,
  sendPasswordResetOTP,
  verifyPasswordResetOTP,
} from "../../Utils/index.utils.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/logout", logout);

router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

router.put(
  "/updateProfile",
  protectRoute,
  upload.single("profilePic"),
  updateProfile
);
router.get("/check", protectRoute, checkAuth);
router.post("/refresh-token", refreshAccessToken);
router.put("/change-password", protectRoute, changePassword);

router.post("/forgot-password/send-otp", sendPasswordResetOTP);
router.post("/forgot-password/verify-otp", verifyPasswordResetOTP);
router.post("/forgot-password/change-password", protectRoute, resetPassword);

router.get("/user-details", protectRoute, userDetails);

export default router;
