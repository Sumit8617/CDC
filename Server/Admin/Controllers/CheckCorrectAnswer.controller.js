import cron from "node-cron";
import mongoose from "mongoose";
import { SubmittedOption } from "../../Admin/Models/SubmitedOption.model.js";
import { Test } from "../../Admin/Models/Contest.model.js";
import { Leaderboard } from "../../Admin/Models/Leaderboard.models.js";
import { MongoQueue } from "../../Admin/Models/SubmissionQuee.models.js";

// DELAY CONFIG (minutes) TODO: Update the Delay time for publishing the leaderboard
const LEADERBOARD_DELAY_MINUTES = 5;

// Run cron every minute
cron.schedule("* * * * *", async () => {
  const now = new Date();
  console.log("Cron running:", now.toISOString());

  try {
    const contests = await Test.find({
      isPublished: true,
      status: { $in: ["active", "pending", "completed"] },
    });

    for (const contest of contests) {
      const contestEnd = new Date(
        contest.date.getTime() + contest.duration * 60 * 1000
      );

      if (now < contestEnd) {
        if (contest.status !== "active") {
          contest.status = "active";
          await contest.save();
        }
        console.log(
          `⏳ Contest ${contest._id} running. Ends in ${Math.ceil(
            (contestEnd - now) / 60000
          )} min`
        );
        continue;
      }

      const leaderboardPublishTime = new Date(
        contestEnd.getTime() + LEADERBOARD_DELAY_MINUTES * 60 * 1000
      );

      if (now < leaderboardPublishTime) {
        console.log(
          `⏳ Delay active for contest ${contest._id}. Remaining: ${Math.ceil(
            (leaderboardPublishTime - now) / 60000
          )} min`
        );
        continue;
      }

      const pendingJobs = await MongoQueue.countDocuments({
        "payload.contest": contest._id.toString(),
        status: { $in: ["pending", "processing"] },
      });

      if (pendingJobs > 0) {
        console.log(
          `⏳ Waiting for ${pendingJobs} queue jobs to finish for contest ${contest._id}`
        );
        continue;
      }

      const existingLeaderboard = await Leaderboard.findOne({
        contest: contest._id,
      });

      if (existingLeaderboard) {
        if (contest.status !== "completed") {
          contest.status = "completed";
          await contest.save();
        }
        console.log(`✔ Contest ${contest._id} already completed`);
        continue;
      }

      const submissions = await SubmittedOption.find({
        contest: contest._id,
        score: { $gt: 0 }, // Only include processed submissions with scores
      })
        .populate("user", "fullName");

      // Build leaderboard data even if empty - this ensures leaderboard is "published"
      const leaderboardMap = {};

      // Get total questions from contest
      const totalQuestions = contest.questions ? contest.questions.length : 0;

      if (submissions.length > 0) {
        submissions.forEach((sub) => {
          if (!sub.user) return;

          const userId = sub.user._id instanceof mongoose.Types.ObjectId
            ? sub.user._id
            : new mongoose.Types.ObjectId(sub.user._id);

          if (!leaderboardMap[userId.toString()]) {
            leaderboardMap[userId.toString()] = {
              user: userId,
              fullName: sub.user.fullName || "Unknown",
              score: 0,
              totalQuestions: totalQuestions,
            };
          }
          // Accumulate scores from all submissions
          leaderboardMap[userId.toString()].score += sub.score || 0;
        });
      }

      const leaderboardData = Object.values(leaderboardMap).sort(
        (a, b) => b.score - a.score
      );

      console.log(`Saving leaderboard for contest ${contest._id}:`, JSON.stringify(leaderboardData.slice(0, 2)));

      // Always create leaderboard document to mark it as published
      const leaderboardEntry = await Leaderboard.findOneAndUpdate(
        { contest: contest._id },
        {
          contest: contest._id,
          data: leaderboardData,
          publishedAt: now,
        },
        { upsert: true, new: true }
      );

      console.log(`Leaderboard saved successfully:`, leaderboardEntry._id);

      contest.status = "completed";
      await contest.save();

      console.log(`Leaderboard published for contest ${contest._id} with ${leaderboardData.length} participants`);
    }
  } catch (err) {
    console.error("Cron error:", err);
  }
});
