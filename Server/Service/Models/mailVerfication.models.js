import mongoose from "mongoose";

const mailVerficationsSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    attempts: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Automatically remove expired OTP records
mailVerficationsSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const mailVerification = mongoose.model(
  "mailVerification",
  mailVerficationsSchema
);
