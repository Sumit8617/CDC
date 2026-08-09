import { asynchandler, APIERR, APIRES } from "../index.utils.js";
import { redis } from "../../config/redis.config.js";
import { mailVerification } from "../../Service/Models/mailVerfication.models.js";

export const verifyOTP = asynchandler(async (req, res) => {
  const { email, otp } = req.body;
  console.log("Coming from the body => ", req.body);
  if (!email || !otp) {
    throw new APIERR(400, "Email and OTP are required");
  }

  const normalizedMail = email.trim().toLowerCase();
  const submittedOTP = String(otp).trim();
  const MAX_ATTEMPTS = 5;
  const redisKey = `otp:${normalizedMail}`;

  // Try Redis first
  const redisData = await redis.get(redisKey);
  let verification = null;

  if (redisData) {
    try {
      const parsedData = JSON.parse(redisData);
      const {
        otp: redisOTP,
        attempts: redisAttempts = 0,
        expiresAt: redisExpiresAt,
      } = parsedData;

      // Check expiry
      if (new Date(redisExpiresAt) < new Date()) {
        await redis.del(redisKey);
        throw new APIERR(400, "OTP has expired. Please generate a new OTP");
      }

      // Check attempts
      if (redisAttempts >= MAX_ATTEMPTS) {
        await redis.del(redisKey);
        throw new APIERR(
          429,
          "Too many incorrect attempts. Please generate a new OTP"
        );
      }

      // Verify OTP
      if (String(redisOTP) !== submittedOTP) {
        const newAttempts = redisAttempts + 1;
        await redis.set(
          redisKey,
          JSON.stringify({
            ...parsedData,
            attempts: newAttempts,
          }),
          "EX",
          600
        );

        const remaining = MAX_ATTEMPTS - newAttempts;
        throw new APIERR(
          400,
          `Incorrect OTP. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining`
        );
      }

      //  OTP verified from Redis
      await redis.del(redisKey);

      // Update database
      verification = await mailVerification.findOne({
        email: normalizedMail,
        verified: false,
      });

      if (verification) {
        verification.verified = true;
        verification.verifiedAt = new Date();
        await verification.save();
      }

      // Set email verification cookie
      res.cookie("isEmailVerified", true, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 1000 * 60 * 15, // 15 minutes
      });

      return res
        .status(200)
        .json(
          new APIRES(
            200,
            { email: normalizedMail, verified: true },
            "OTP verified successfully"
          )
        );
    } catch (error) {
      if (error instanceof APIERR) throw error;
      console.error("Redis error, falling back to database:", error);
    }
  }

  // Fallback to Database
  verification = await mailVerification.findOne({
    email: normalizedMail,
    verified: false,
  });

  if (!verification) {
    throw new APIERR(400, "OTP not found. Please generate a new OTP");
  }

  if (verification.expiresAt < new Date()) {
    await mailVerification.deleteOne({ _id: verification._id });
    await redis.del(redisKey);
    throw new APIERR(400, "OTP has expired. Please generate a new OTP");
  }

  if (verification.attempts >= MAX_ATTEMPTS) {
    await mailVerification.deleteOne({ _id: verification._id });
    await redis.del(redisKey);
    throw new APIERR(
      429,
      "Too many incorrect attempts. Please generate a new OTP"
    );
  }

  if (String(verification.otp) !== submittedOTP) {
    verification.attempts += 1;
    await verification.save();

    const remaining = MAX_ATTEMPTS - verification.attempts;
    throw new APIERR(
      400,
      `Incorrect OTP. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining`
    );
  }

  // OTP verified from database
  verification.verified = true;
  verification.verifiedAt = new Date();
  await verification.save();
  await redis.del(redisKey);

  // Set email verification cookie
  res.cookie("isEmailVerified", true, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 1000 * 60 * 15,
  });

  return res
    .status(200)
    .json(
      new APIRES(
        200,
        { email: normalizedMail, verified: true },
        "OTP verified successfully"
      )
    );
});
