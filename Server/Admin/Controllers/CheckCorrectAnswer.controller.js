import cron from "node-cron";
import { SubmittedOption } from "../../Admin/Models/SubmitedOption.model.js";
import { Test } from "../../Admin/Models/Contest.model.js";
import { Leaderboard } from "../../Admin/Models/Leaderboard.models.js";

// Run cron every minute
cron.schedule("* * * * *", async () => {
  const now = new Date();
  console.log("Cron running:", now.toISOString());

  try {
    // Fetch contests that are pending
    const contests = await Test.find({ status: "pending" });

    for (const contest of contests) {
      const contestStart = new Date(contest.date); // UTC stored in DB
      const contestEnd = new Date(
        contestStart.getTime() + contest.duration * 60 * 1000
      );
      const leaderboardPublishTime = new Date(
        contestEnd.getTime() + 30 * 60 * 1000
      ); // 30 min after end

      // Skip contests that haven't ended yet
      if (now < leaderboardPublishTime) {
        console.log(
          `Waiting to publish leaderboard for contest ${contest._id}, time remaining: ${Math.floor((leaderboardPublishTime - now) / 60000)}m`
        );
        continue;
      }

      // Skip if leaderboard already exists
      const existingLeaderboard = await Leaderboard.findOne({
        contest: contest._id,
      });
      if (existingLeaderboard) {
        if (contest.status !== "completed") {
          contest.status = "completed";
          await contest.save();
        }
        continue;
      }

      // Fetch submissions with populated correct answers
      const submissions = await SubmittedOption.find({ contest: contest._id })
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
          if (!q.question || q.question.correctOption === undefined) return;

          const submitted = Number(q.submittedOption);
          const correct = Number(q.question.correctOption);
          const isCorrect = submitted === correct;

          if (!leaderboardMap[sub.user._id]) {
            leaderboardMap[sub.user._id] = {
              user: sub.user._id,
              fullName: sub.user.fullName || "Unknown",
              score: 0,
            };
          }

          leaderboardMap[sub.user._id].score += isCorrect ? 5 : 0;
        });
      });

      const leaderboardData = Object.values(leaderboardMap).sort(
        (a, b) => b.score - a.score
      );

      if (leaderboardData.length === 0) {
        console.log(`No valid submissions for contest ${contest._id}`);
        contest.status = "completed";
        await contest.save();
        continue;
      }

      // Create leaderboard
      await Leaderboard.create({
        contest: contest._id,
        data: leaderboardData,
        publishedAt: now,
      });

      console.log(`✔ Leaderboard published for contest ${contest._id}`);

      // Mark contest as completed
      contest.status = "completed";
      await contest.save();
    }
  } catch (err) {
    console.error("Cron error:", err);
  }
});
