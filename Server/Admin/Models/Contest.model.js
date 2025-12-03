import mongoose from "mongoose";

const testSchema = new mongoose.Schema(
  {
    testName: { type: String, required: true },
    description: { type: String, required: true, maxlength: 250 },
    date: { type: Date, required: true },
    duration: { type: Number, required: true },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: true,
      },
    ],
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending", // new contests start as pending
    },
    notificationsSent: {
      type: Boolean,
      default: false, // to track if notifications have been sent
    },
  },
  { timestamps: true }
);

export const Test = mongoose.model("Test", testSchema)