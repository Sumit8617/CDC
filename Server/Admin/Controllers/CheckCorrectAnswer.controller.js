import cron from "node-cron";
import { SubmittedOption } from "../../Admin/Models/SubmitedOption.model.js";
import { Test } from "../../Admin/Models/Contest.model.js";
import { Leaderboard } from "../../Admin/Models/Leaderboard.models.js";
import { MongoQueue } from "../../Admin/Models/SubmissionQuee.models.js"; // ✅ Added

// DELAY CONFIG (minutes)
const LEADERBOARD_DELAY_MINUTES = 2;

// Run cron every minute
cron.schedule("* * * * *", async () => {
  const now = new Date();
  console.log("Cron running:", now.toISOString());

  try {
    const contests = await Test.find({
      isPublished: true,
      status: { $ne: "completed" },
    });

    for (const contest of contests) {
      const contestEnd = new Date(
        contest.date.getTime() + contest.duration * 60 * 1000
      );

      // Contest still running
      if (now < contestEnd) {
        console.log(
          `⏳ Contest ${contest._id} running. Ends in ${Math.ceil(
            (contestEnd - now) / 60000
          )} min`
        );
        continue;
      }

      // Delay window before publishing leaderboard
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

      // Check if any submission jobs are pending or processing
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

      // Leaderboard already created
      const existingLeaderboard = await Leaderboard.findOne({
        contest: contest._id,
      });

      if (existingLeaderboard) {
        contest.status = "completed";
        await contest.save();
        console.log(`✔ Contest ${contest._id} already completed`);
        continue;
      }

      // Fetch submissions
      const submissions = await SubmittedOption.find({
        contest: contest._id,
      })
        .populate("user", "fullName")
        .populate({
          path: "questions.question",
          model: "Question",
          select: "correctOption",
        });

      const leaderboardMap = {};

      submissions.forEach((sub) => {
        if (!sub.user) return;

        sub.questions.forEach((q) => {
          if (!q.question) return;

          if (!leaderboardMap[sub.user._id]) {
            leaderboardMap[sub.user._id] = {
              user: sub.user._id,
              fullName: sub.user.fullName || "Unknown",
              score: 0,
            };
          }

          if (Number(q.submittedOption) === Number(q.question.correctOption)) {
            leaderboardMap[sub.user._id].score += 5;
          }
        });
      });

      const leaderboardData = Object.values(leaderboardMap).sort(
        (a, b) => b.score - a.score
      );

      await Leaderboard.create({
        contest: contest._id,
        data: leaderboardData,
        publishedAt: now,
      });

      contest.status = "completed";
      await contest.save();

      console.log(`Leaderboard published for contest ${contest._id}`);
    }
  } catch (err) {
    console.error("Cron error:", err);
  }
});
