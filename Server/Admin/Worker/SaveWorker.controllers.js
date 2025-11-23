import { MongoQueue } from "../Models/SubmissionQuee.models.js";
import { SubmittedOption } from "../Models/SubmitedOption.model.js";

export async function processSubmissionJob(job) {
  try {
    console.log("\n➡ Processing Job:", job._id);

    const { submissionId, contest, user } = job.payload;

    // Retry-safe submission fetching
    let submission = null;
    for (let attempt = 0; attempt < 6; attempt++) {
      submission = await SubmittedOption.findById(submissionId);
      if (submission) break;
      await new Promise((res) => setTimeout(res, 200)); // wait 200ms
    }

    if (!submission) {
      throw new Error("Submission not found after retries!");
    }

    console.log(
      `✔ Submission Verified for User: ${user} | Contest: ${contest}`
    );

    job.status = "completed";
    job.lockedAt = null;
    await job.save();
  } catch (err) {
    console.error("❌ Worker Error:", err.message);

    job.attempts += 1;

    if (job.attempts >= job.maxAttempts) {
      job.status = "failed";
      job.error = err.message;
      console.log("❌ Job Failed Permanently:", job._id);
    } else {
      job.status = "pending";
      job.lockedAt = null;
      console.log("🔁 Retrying Job:", job._id);
    }

    await job.save();
  }
}
