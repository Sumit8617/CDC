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

router
  .post("/login", login)
  .post("/signup", signup)
  .post("/logout", logout)
  .post("/send-otp", sendOTP)
  .post("/verify-otp", verifyOTP)
  .put(
    "/updateProfile",
    protectRoute,
    upload.single("profilePic"),
    updateProfile
  )
  .get("/check", protectRoute, checkAuth)
  .post("/refresh-token", refreshAccessToken)
  .put("/change-password", protectRoute, changePassword)
  .post("/forgot-password/send-otp", sendPasswordResetOTP)
  .post("/forgot-password/verify-otp", verifyPasswordResetOTP)
  .post("/forgot-password/change-password", resetPassword)
  .get("/user-details", protectRoute, userDetails);

export default router;
