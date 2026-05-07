import mongoose from "mongoose";

const submittedOptionSchema = new mongoose.Schema(
  {
    contest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    questions: [
      {
        question: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
          required: true,
        },
        submittedOption: {
          type: Number,
          required: true,
        },
        checked: { type: Boolean, default: false },
        isCorrect: { type: Boolean, default: false },
      },
    ],
    score: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// TTL index - 24 hours (increased to allow leaderboard processing)
submittedOptionSchema.index(
  { autoDeleteAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 }
);

export const SubmittedOption = mongoose.model(
  "SubmittedOption",
  submittedOptionSchema
);
