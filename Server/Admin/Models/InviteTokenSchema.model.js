import mongoose from "mongoose";
const inviteTokenSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
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
      expires: 24 * 60 * 60,
    },
  },
  { timestamps: true }
);

export const InviteToken = mongoose.model("InviteToken", inviteTokenSchema);
