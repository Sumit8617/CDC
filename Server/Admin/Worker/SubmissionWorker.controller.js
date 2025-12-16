import { MongoQueue } from "../Models/SubmissionQuee.models.js";
import { processSubmissionJob } from "./SaveWorker.controllers.js";

export async function startSubmissionWorker() {
  console.log("🚀 Submission Worker Started");

  while (true) {
    const job = await MongoQueue.findOneAndUpdate(
      {
        status: "pending",
        lockedAt: null,
      },
      {
        status: "processing",
        lockedAt: new Date(),
      },
      { new: true }
    );

    if (!job) {
      await new Promise((r) => setTimeout(r, 300));
      continue;
    }

    await processSubmissionJob(job);
  }
}
