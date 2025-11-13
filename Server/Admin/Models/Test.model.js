import mongoose from "mongoose"

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
export  const Test = mongoose.model("Test", testSchema) ;