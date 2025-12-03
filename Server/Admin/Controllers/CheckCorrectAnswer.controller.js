import cron from "node-cron";
import { SubmittedOption } from "../../Admin/Models/SubmitedOption.model.js";
import { Test } from "../../Admin/Models/Contest.model.js";
import { Leaderboard } from "../../Admin/Models/Leaderboard.models.js";

cron.schedule("* * * * *", async () => {
  const now = new Date();
  console.log("Cron running:", now.toISOString());

  try {
    const contests = await Test.find({ status: "pending" });

    for (const contest of contests) {
      const contestEnd = new Date(
        contest.date.getTime() + contest.duration * 60 * 1000
      );
      const publishTime = new Date(contestEnd.getTime() + 15 * 60 * 1000);

      // Skip until ready
      if (now < publishTime) {
        const ms = publishTime - now;
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);

        console.log(
          `Waiting for publish time for contest ${contest._id}, Time remaining => ${minutes}m ${seconds}s`
        );
        continue;
      }

      // Leaderboard already exists
      const existingLb = await Leaderboard.findOne({ contest: contest._id });
      if (existingLb) {
        if (contest.status !== "completed") {
          contest.status = "completed";
          await contest.save();
        }
        continue;
      }

      // Fetch submissions with correct populate
      const submissions = await SubmittedOption.find({ contest: contest._id })
        .populate("user", "fullName")
        .populate({
          path: "questions.question",
          model: "Question", // update to your correct model name
          select: "correctOption",
        });

      console.log("Submissions:", submissions.length, submissions);

      const leaderboardMap = {};

      submissions.forEach((sub) => {
        if (!sub.user) return;

        sub.questions.forEach((q) => {
          if (!q.question || q.question.correctOption === undefined) {
            console.log("Missing correctOption for", q);
            return;
          }

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
        console.log(`No leaderboard data for contest ${contest._id}`);
        continue;
      }

      await Leaderboard.create({
        contest: contest._id,
        data: leaderboardData,
        publishedAt: now,
      });

      console.log(`✔ Leaderboard published for contest ${contest._id}`);

      contest.status = "completed";
      await contest.save();
    }
  } catch (err) {
    console.error("Cron error:", err);
  }
});
