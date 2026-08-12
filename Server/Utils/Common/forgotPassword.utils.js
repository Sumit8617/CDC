import { User } from "../../Service/Models/User.models.js";
import { asynchandler, APIERR, sendMail } from "../index.utils.js";
import redis from "../../config/redis.config.js";

// Redis key prefixes for forgot-password flow
const FP_OTP_KEY = (email) => `fp:otp:${email.toLowerCase()}`;
const FP_VERIFIED_KEY = (email) => `fp:verified:${email.toLowerCase()}`;

// TTL: 5 minutes (matches the previous cookie maxAge)
const FP_TTL_SECONDS = 5 * 60;

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

  // Password reset OTP email HTML
  const resetOtpHtml = `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f0f2f5; padding: 40px 20px;">
    <div style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.08);">

      <!-- Header -->
      <div style="background: linear-gradient(135deg, #FF6B00, #FF9A00); padding: 40px 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0 0 6px 0; font-size: 28px; font-weight: 700; letter-spacing: 1px;">
          ${process.env.APP_NAME}
        </h1>
        <p style="color: rgba(255,255,255,0.85); margin: 0; font-size: 14px; letter-spacing: 0.5px;">
          Password Reset Request
        </p>
      </div>

      <!-- Lock Icon Banner -->
      <div style="background-color: #fff8f2; padding: 24px; text-align: center; border-bottom: 1px solid #ffe8d6;">
        <div style="display: inline-block; background-color: #fff0e0; border-radius: 50%; width: 64px; height: 64px; line-height: 64px; font-size: 30px;">
          🔐
        </div>
      </div>

      <!-- Body -->
      <div style="padding: 36px 40px;">
        <h2 style="color: #1a1a1a; font-size: 22px; margin: 0 0 12px 0; font-weight: 600;">
          Hello, ${user.fullName.split(" ")[0]}!
        </h2>
        <p style="color: #666666; font-size: 15px; line-height: 1.8; margin: 0 0 28px 0;">
          We received a request to reset your password. Use the OTP below to proceed.
          For your security, this code will expire in
          <strong style="color: #FF6B00;">5 minutes</strong>.
        </p>

        <!-- OTP Box -->
        <div style="background: linear-gradient(135deg, #fff8f2, #fff0e0); border: 1.5px solid #FF6B00;
                    border-radius: 14px; padding: 28px; text-align: center; margin: 0 0 28px 0;">
          <p style="margin: 0 0 8px 0; color: #999; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">
            Your One-Time Password
          </p>
          <p style="margin: 0; font-size: 42px; font-weight: 800; color: #FF6B00; letter-spacing: 14px;">
            ${otp}
          </p>
        </div>

        <!-- Warning Box -->
        <div style="background-color: #fff8f2; border-left: 4px solid #FF6B00; border-radius: 6px; padding: 14px 18px; margin: 0 0 28px 0;">
          <p style="margin: 0; color: #888; font-size: 13px; line-height: 1.7;">
            ⚠️ <strong>Did not request this?</strong> If you did not request a password reset,
            please ignore this email or immediately contact our
            <a href="mailto:${process.env.SUPPORT_EMAIL}" style="color: #FF6B00; text-decoration: none; font-weight: 600;">
              support team
            </a>.
          </p>
        </div>

        <p style="color: #aaaaaa; font-size: 13px; line-height: 1.7; margin: 0;">
          For security reasons, never share this OTP with anyone.
          Our team will never ask you for this code.
        </p>
      </div>

      <!-- Divider -->
      <div style="height: 1px; background-color: #f0f0f0; margin: 0 40px;"></div>

      <!-- Footer -->
      <div style="padding: 24px 40px; text-align: center;">
        <p style="color: #bbbbbb; font-size: 13px; margin: 0 0 6px 0;">
          This is an automated email, please do not reply.
        </p>
        <p style="color: #bbbbbb; font-size: 13px; margin: 0;">
          © ${new Date().getFullYear()} <strong style="color: #FF6B00;">${process.env.APP_NAME}</strong>. All rights reserved.
        </p>
      </div>

    </div>
  </div>
`;

  const mailSent = await sendMail(
    user.email,
    `Password Reset OTP for ${process.env.APP_NAME}`,
    resetOtpHtml
  );
  if (!mailSent) {
    throw new APIERR(500, "Error while sending the OTP email");
  }

  // Also clear any stale verified marker from a previous attempt.
  await redis.set(FP_OTP_KEY(email), String(otp), "EX", FP_TTL_SECONDS);
  await redis.del(FP_VERIFIED_KEY(email));

  return res
    .status(200)
    .json(new APIERR(200, {}, "OTP sent to your email successfully"));
});

export const verifyPasswordResetOTP = asynchandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email) {
    throw new APIERR(400, "Email is required to verify the OTP");
  }
  if (!otp) {
    throw new APIERR(400, "Please provide the OTP");
  }

  const storedOTP = await redis.get(FP_OTP_KEY(email));

  if (!storedOTP) {
    throw new APIERR(400, "OTP Expired. Please try again");
  }

  if (String(otp) !== String(storedOTP)) {
    throw new APIERR(400, "Invalid OTP. Please try again");
  }

  // OTP is correct: move it to a verified marker (same TTL) and clear the OTP key.
  await redis.set(FP_VERIFIED_KEY(email), "1", "EX", FP_TTL_SECONDS);
  await redis.del(FP_OTP_KEY(email));

  return res.status(200).json(new APIERR(200, {}, "OTP verified successfully"));
});

export const resetPassword = asynchandler(async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;

  if (!email) {
    throw new APIERR(400, "Email is required to reset the password");
  }
  if (!newPassword || !confirmPassword) {
    throw new APIERR(400, "Please provide the required fields");
  }
  if (newPassword !== confirmPassword) {
    throw new APIERR(400, "Password and Confirm Password do not match");
  }

  const isVerified = await redis.get(FP_VERIFIED_KEY(email));
  if (!isVerified) {
    throw new APIERR(400, "OTP verification required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new APIERR(404, "User not found");
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  // Clear the verified marker now that the password has been reset.
  await redis.del(FP_VERIFIED_KEY(email));

  return res
    .status(200)
    .json(new APIERR(200, {}, "Password reset successfully"));
});
