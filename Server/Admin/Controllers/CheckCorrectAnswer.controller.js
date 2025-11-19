import cron from "node-cron";
import { SubmittedOption } from "../../Admin/Models/SubmitedOption.model.js";
import { Test } from "../../Admin/Models/Contest.model.js";
import { Leaderboard } from "../../Admin/Models/Leaderboard.models.js";

cron.schedule("* * * * *", async () => {
  const now = new Date();
  console.log("⏳ Cron running:", now);

  try {
    // Fetch all contests
    const contests = await Test.find();

    for (const contest of contests) {
      // Calculate contest end time + 15 minutes
      const contestEndTime = new Date(
        contest.date.getTime() + contest.duration * 60 * 1000
      );
      const publishTime = new Date(contestEndTime.getTime() + 15 * 60 * 1000);

      if (now < publishTime) {
        // Remaining time
        const remainingMs = publishTime.getTime() - now.getTime();
        const remainingMinutes = Math.floor(remainingMs / 60000);
        const remainingSeconds = Math.floor((remainingMs % 60000) / 1000);

        console.log(
          `Leaderboard for contest ${contest._id} will be published in ${remainingMinutes} minutes and ${remainingSeconds} seconds`
        );
        continue;
      }

      // Skip if leaderboard already exists
      const existingLeaderboard = await Leaderboard.findOne({
        contest: contest._id,
      });
      if (existingLeaderboard) {
        console.log(`Leaderboard already published for contest ${contest._id}`);
        continue;
      }

      // Get all submissions and populate nested questions correctly
      const submissions = await SubmittedOption.find({ contest: contest._id })
        .populate("user")
        .populate({
          path: "questions.question",
          model: "Question",
        });

      const leaderboardMap = {};

      submissions.forEach((sub) => {
        if (!sub.user) return; // skip if user not populated

        sub.questions.forEach((q, idx) => {
          if (!q.question) {
            console.warn(
              `Question not populated for submission ${sub._id}, question index ${idx}`
            );
            return;
          }

          const submitted = Number(q.submittedOption);
          const correct = Number(q.question.correctOption);
          const isCorrect = submitted === correct;

          if (!leaderboardMap[sub.user._id]) {
            leaderboardMap[sub.user._id] = {
              user: sub.user._id,
              fullName: sub.user.fullName,
              score: 0,
            };
          }

          leaderboardMap[sub.user._id].score += isCorrect ? 5 : 0;

          // Mark as checked
          q.checked = true;
        });
      });

      // Save updated submission documents
      await Promise.all(submissions.map((s) => s.save()));

      const leaderboardData = Object.values(leaderboardMap).sort(
        (a, b) => b.score - a.score
      );

      if (leaderboardData.length === 0) {
        console.warn(
          `No leaderboard data calculated for contest ${contest._id}`
        );
        continue;
      }

      await Leaderboard.create({
        contest: contest._id,
        data: leaderboardData,
        publishedAt: now,
      });

      console.log(`✅ Leaderboard published for contest ${contest._id}`);
    }
  } catch (err) {
    console.error("Error in leaderboard cron:", err);
  }
});
