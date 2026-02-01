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
  },
  { timestamps: true }
);

inviteTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

export const InviteToken = mongoose.model("InviteToken", inviteTokenSchema);
