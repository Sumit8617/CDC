import mongoose from "mongoose";

const testSchema = new mongoose.Schema(
  {
    testName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 250,
    },
    date: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

testSchema.methods.predictContestEndTime = function () {
  if (!this.date || !this.duration) return null;
  const endTime = new Date(this.date.getTime() + this.duration * 60 * 1000);
  return endTime;
};

export const Test = mongoose.model("Test", testSchema);
