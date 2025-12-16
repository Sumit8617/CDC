import cron from "node-cron";
import { MongoQueue } from "../Admin/Models/SubmissionQuee.models.js";

// Runs every 5 minutes
cron.schedule("*/5 * * * *", async () => {
  console.log("Reset StuckJobs Cron running at", new Date().toISOString());
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

  const result = await MongoQueue.updateMany(
    {
      status: "processing",
      lockedAt: { $lt: tenMinutesAgo },
    },
    {
      status: "pending",
      lockedAt: null,
    }
  );

  if (result.modifiedCount > 0) {
    console.log(`🔁 Reset ${result.modifiedCount} stuck queue jobs`);
  }
});
