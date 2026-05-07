import { User } from "../Models/User.models.js";
import { Test } from "../../Admin/Models/Contest.model.js";
import Result from "../Models/Result.models.js";
import { asynchandler, APIRES } from "../../Utils/index.utils.js";

const getUserStats = asynchandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json(new APIRES(404, null, "User not found"));
  }

  const results = await Result.find({ userId }).sort({ submittedAt: -1 });
  const totalContests = results.length;

  const totalScore = results.reduce((sum, r) => sum + r.score, 0);
  const avgScore =
    totalContests > 0
      ? Math.round(
          ((totalScore / totalContests) * 100) / results[0]?.totalQuestions || 1
        )
      : 0;

  const bestRank = user.bestRank || "N/A";

  res.status(200).json(
    new APIRES(
      200,
      {
        totalContests,
        bestRank,
        avgScore,
        currentStreak: user.currentStreak || 0,
      },
      "User stats fetched successfully"
    )
  );
});

const getUserPerformance = asynchandler(async (req, res) => {
  const userId = req.user._id;

  const results = await Result.find({ userId })
    .sort({ submittedAt: -1 })
    .limit(20)
    .populate("quizId", "testName date");

  const performanceData = results.reverse().map((r, index) => ({
    week: `Week ${index + 1}`,
    score:
      r.totalQuestions > 0 ? Math.round((r.score / r.totalQuestions) * 100) : 0,
    percentile: 0,
    contestName: r.quizId?.testName || `Contest ${index + 1}`,
    submittedAt: r.submittedAt,
  }));

  res
    .status(200)
    .json(
      new APIRES(200, performanceData, "User performance fetched successfully")
    );
});

const getUpcomingContests = asynchandler(async (req, res) => {
  const now = new Date();

  const upcomingContests = await Test.find({
    date: { $gt: now },
    isPublished: true,
    isDraft: false,
  })
    .select("testName date duration description")
    .sort({ date: 1 })
    .limit(10);

  res
    .status(200)
    .json(
      new APIRES(
        200,
        upcomingContests,
        "Upcoming contests fetched successfully"
      )
    );
});

const getRecentHistory = asynchandler(async (req, res) => {
  const userId = req.user._id;

  const results = await Result.find({ userId })
    .sort({ submittedAt: -1 })
    .limit(20)
    .populate("quizId", "testName date");

  const history = results.map((r) => ({
    _id: r._id,
    contestName: r.quizId?.testName || "Unknown Contest",
    contestDate: r.quizId?.date || r.submittedAt,
    score: r.score,
    totalQuestions: r.totalQuestions,
    percentage:
      r.totalQuestions > 0 ? Math.round((r.score / r.totalQuestions) * 100) : 0,
    timeTaken: r.timeTaken,
    submittedAt: r.submittedAt,
  }));

  res
    .status(200)
    .json(new APIRES(200, history, "Recent history fetched successfully"));
});

export {
  getUserStats,
  getUserPerformance,
  getUpcomingContests,
  getRecentHistory,
};
