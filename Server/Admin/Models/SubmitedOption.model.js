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
        checked: {
          type: Boolean,
          default: false,
        },
      },
    ],
    autoDeleteAt: {
      type: Date,
      default: Date.now,
      expires: 60 * 60 * 5, // 5 hours
    },
  },
  { timestamps: true }
);

export const SubmittedOption = mongoose.model(
  "SubmittedOption",
  submittedOptionSchema
);
