import { SubmittedOption } from "../Models/SubmitedOption.model.js";

export async function processSubmissionJob(job) {
  try {
    console.log("➡ Processing job:", job._id);

    const { submissionId } = job.payload;

    let submission = null;

    for (let i = 0; i < 5; i++) {
      submission = await SubmittedOption.findById(submissionId);
      if (submission) break;
      await new Promise((r) => setTimeout(r, 200));
    }

    if (!submission) {
      throw new Error("Submission not found");
    }

    job.status = "completed";
    job.lockedAt = null;
    await job.save();

    console.log("✔ Submission verified:", submissionId);
  } catch (err) {
    job.attempts += 1;

    if (job.attempts >= job.maxAttempts) {
      job.status = "failed";
      job.error = err.message;
      console.error("❌ Job failed:", job._id);
    } else {
      job.status = "pending";
      job.lockedAt = null;
      console.log("🔁 Retrying job:", job._id);
    }

    await job.save();
  }
}
