import { User } from "../Models/User.models.js";
import { Test } from "../../Admin/Models/Contest.model.js";
import Result from "../Models/Result.models.js";
import { asynchandler, APIRES } from "../../Utils/index.utils.js";
import { cachedFetch, cacheDelete, CACHE_KEYS, CACHE_TTL } from "../../Utils/RedisCache.utils.js";

const getUserStats = asynchandler(async (req, res) => {
  const userId = req.user._id;
  const cacheKey = `${CACHE_KEYS.USER_STATS}${userId}:v1`;

  const fetchUserStats = async () => {
    const user = await User.findById(userId);
    if (!user) {
      return null;
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

    return {
      totalContests,
      bestRank,
      avgScore,
      currentStreak: user.currentStreak || 0,
    };
  };

  const stats = await cachedFetch(cacheKey, fetchUserStats, CACHE_TTL.USER_STATS);

  if (!stats) {
    return res.status(404).json(new APIRES(404, null, "User not found"));
  }

  res.status(200).json(
    new APIRES(
      200,
      stats,
      "User stats fetched successfully"
    )
  );
});

const getUserPerformance = asynchandler(async (req, res) => {
  const userId = req.user._id;
  const cacheKey = `${CACHE_KEYS.USER_PERFORMANCE}${userId}:v1`;

  const fetchPerformance = async () => {
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

    return performanceData;
  };

  const performanceData = await cachedFetch(cacheKey, fetchPerformance, CACHE_TTL.USER_PERFORMANCE);

  res
    .status(200)
    .json(
      new APIRES(200, performanceData, "User performance fetched successfully")
    );
});

const getUpcomingContests = asynchandler(async (req, res) => {
  const cacheKey = `${CACHE_KEYS.UPCOMING_CONTESTS}dashboard:v1`;

  const fetchUpcoming = async () => {
    const now = new Date();

    const upcomingContests = await Test.find({
      date: { $gt: now },
      isPublished: true,
      isDraft: false,
    })
      .select("testName date duration description")
      .sort({ date: 1 })
      .limit(10);

    return upcomingContests;
  };

  const upcomingContests = await cachedFetch(cacheKey, fetchUpcoming, CACHE_TTL.UPCOMING_CONTESTS);

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
  const cacheKey = `${CACHE_KEYS.USER_DASHBOARD}${userId}:history:v1`;

  const fetchHistory = async () => {
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

    return history;
  };

  const history = await cachedFetch(cacheKey, fetchHistory, CACHE_TTL.USER_DASHBOARD);

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
