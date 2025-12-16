import mongoose from "mongoose";

const mongoQueueSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    payload: { type: Object, required: true },

    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },

    attempts: { type: Number, default: 0 },
    maxAttempts: { type: Number, default: 3 },

    lockedAt: { type: Date, default: null },
    error: { type: String, default: "" },
  },
  { timestamps: true }
);

mongoQueueSchema.index({ "payload.contest": 1, status: 1 });

export const MongoQueue = mongoose.model("MongoQueue", mongoQueueSchema);
