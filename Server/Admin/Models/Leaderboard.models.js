import mongoose from "mongoose";

const leaderboardSchema = new mongoose.Schema(
  {
    contest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: true,
      unique: true, // Only one leaderboard per contest
    },
    data: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        fullName: { type: String, required: true },
        score: { type: Number, required: true },
      },
    ],
    publishedAt: { type: Date, default: null }, // Will be set when leaderboard is published
  },
  { timestamps: true }
);

// Prevent duplicate users per contest
leaderboardSchema.index({ contest: 1, "data.user": 1 }, { unique: true });

export const Leaderboard = mongoose.model("Leaderboard", leaderboardSchema);
