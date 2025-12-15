import { User } from "../../Service/Models/User.models.js";
import { asynchandler, APIERR } from "../index.utils.js";
import { contestNotification } from "../Mail/ContestNotification.js";

export const sendPasswordResetOTP = asynchandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new APIERR(400, "Please provide your email");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new APIERR(404, "User not found with this email");
  }

  const otp = Math.floor(1000 + Math.random() * 9000);

  const templateId = process.env.EMAILJS_FORGOT_PASSWORD_OTP_TEMPLATE_ID;
  const templateData = {
    to_name: user.fullName.split(" ")[0],
    to_email: user.email,
    otp,
    expiry: 5,
    date: new Date().getFullYear(),
    APP_NAME: process.env.APP_NAME,
  };

  const mailSent = await contestNotification(templateId, templateData);
  if (!mailSent) {
    throw new APIERR(500, "Error while sending the OTP email");
  }

  res.cookie("fp_otp", otp, {
    httpOnly: true,
    secure: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "none",
    path: "/",
    maxAge: 5 * 60 * 1000,
  });

  res.cookie("fp_email", email, {
    httpOnly: true,
    secure: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "none",
    path: "/",
    maxAge: 5 * 60 * 1000,
  });

  return res
    .status(200)
    .json(new APIERR(200, {}, "OTP sent to your email successfully"));
});

export const verifyPasswordResetOTP = asynchandler(async (req, res) => {
  const { otp } = req.body;
  const storedOTP = req.cookies?.fp_otp;
  const email = req.cookies?.fp_email;

  if (!otp) {
    throw new APIERR(400, "Please provide the OTP");
  }

  if (!storedOTP || !email) {
    throw new APIERR(400, "OTP Expired. Please try again");
  }

  if (string(otp) !== string(storedOTP)) {
    throw new APIERR(400, "Invalid OTP. Please try again");
  }

  res.cookie("fp_verified", email, {
    httpOnly: true,
    secure: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "none",
    path: "/",
    maxAge: 5 * 60 * 1000,
  });
  res.clearCookie("fp_otp");
  res.clearCookie("fp_email");
  return res.status(200).json(new APIERR(200, {}, "OTP verified successfully"));
});

export const resetPassword = asynchandler(async (req, res) => {
  const { newPassword, confirmPassword } = req.body;
  const email = res.cookies?.fp_verified;

  if (!newPassword || !confirmPassword) {
    throw new APIERR(400, "Please provide the required fields");
  }
  if (newPassword !== confirmPassword) {
    throw new APIERR(400, "Password and Confirm Password do not match");
  }
  if (!email) {
    throw new APIERR(400, "OTP verification required");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new APIERR(404, "User not found");
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  res.clearCookie("fp_verified");

  return res
    .status(200)
    .json(new APIERR(200, {}, "Password reset successfully"));
});
