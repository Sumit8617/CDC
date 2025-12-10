import mongoose from "mongoose";
const inviteTokenSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: [true, "Don't use Same mail for invite"],
    },
    token: {
      type: String,
      required: true,
      default: "",
    },
    role: {
      type: String,
      default: "admin",
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 24 * 60 * 60 * 1000,
    },
  },
  { timestamps: true }
);

export const InviteToken = mongoose.model("InviteToken", inviteTokenSchema);
