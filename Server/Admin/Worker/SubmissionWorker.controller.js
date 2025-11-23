import { MongoQueue } from "../Models/SubmissionQuee.models.js";
import { processSubmissionJob } from "./SaveWorker.controllers.js";

export async function startSubmissionWorker() {
  console.log("🚀 Submission Worker Started...");

  while (true) {
    // Find a pending job and lock it
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
      // No job found → wait 300ms, then continue polling
      await new Promise((res) => setTimeout(res, 300));
      continue;
    }

    // Process the job
    await processSubmissionJob(job);
  }
}
