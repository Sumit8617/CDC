import mongoose from "mongoose";
import { asynchandler, APIRES } from "../../Utils/index.utils.js";
import { Leaderboard } from "../Models/Leaderboard.models.js";
import { Test } from "../Models/Contest.model.js";
import Result from "../../Service/Models/Result.models.js";
import { User } from "../../Service/Models/User.models.js";
import { cachedFetch, CACHE_KEYS, CACHE_TTL } from "../../Utils/RedisCache.utils.js";

const getLeaderboard = asynchandler(async (req, res) => {
  const cacheKey = `${CACHE_KEYS.LEADERBOARD}latest:v1`;

  const fetchLeaderboard = async () => {
    const contest = await Test.findOne({
      status: "completed",
      isPublished: true,
    })
      .sort({ date: -1 })
      .lean();

    if (!contest) {
      return { contest: null, leaderboard: [] };
    }

    // First try to get from Leaderboard model
    let leaderboard = await Leaderboard.findOne({
      contest: contest._id,
    }).lean();

    // If no leaderboard document, generate from Result model
    if (!leaderboard || !leaderboard.data || leaderboard.data.length === 0) {
      const results = await Result.find({ quizId: contest._id })
        .populate("userId", "fullName")
        .lean();

      const leaderboardMap = {};
      results.forEach((r) => {
        if (!r.userId) return;

        // Calculate percentage score
        const percentage = r.totalQuestions > 0
          ? Math.round((r.score / (r.totalQuestions * 5)) * 100)
          : 0;

        if (!leaderboardMap[r.userId._id]) {
          leaderboardMap[r.userId._id] = {
            user: r.userId._id,
            fullName: r.userId.fullName || "Unknown",
            score: r.score || 0, // Raw score in points
            totalQuestions: r.totalQuestions || 0,
            percentage, // Score as percentage
          };
        }
      });

      const leaderboardData = Object.values(leaderboardMap).sort(
        (a, b) => b.score - a.score
      );

      return {
        contest,
        leaderboard: leaderboardData,
      };
    }

    // Add percentage to existing leaderboard data
    const maxScore = contest.questions.length * 5;
    const leaderboardData = (leaderboard?.data || []).map((entry) => ({
      ...entry,
      totalQuestions: contest.questions.length,
      maxScore: maxScore,
      percentage: maxScore > 0 ? Math.round((entry.score / maxScore) * 100) : 0,
    }));

    return {
      contest,
      leaderboard: leaderboardData,
      maxScore,
    };
  };

  const data = await cachedFetch(cacheKey, fetchLeaderboard, CACHE_TTL.LEADERBOARD);

  return res.status(200).json(
    new APIRES(
      200,
      data,
      data.contest ? "Leaderboard fetched" : "No completed contest"
    )
  );
});

// Get leaderboard for a specific contest
const getContestLeaderboard = asynchandler(async (req, res) => {
  const { contestId } = req.params;
  const cacheKey = `${CACHE_KEYS.LEADERBOARD}${contestId}:v1`;

  const fetchSpecificLeaderboard = async () => {
    const contest = await Test.findById(contestId).lean();

    if (!contest || contest.status !== "completed") {
      return { contest: null, leaderboard: [] };
    }

    let leaderboard = await Leaderboard.findOne({
      contest: contest._id,
    }).lean();

    if (!leaderboard || !leaderboard.data || leaderboard.data.length === 0) {
      const results = await Result.find({ quizId: contest._id })
        .populate("userId", "fullName")
        .lean();

      const leaderboardMap = {};
      results.forEach((r) => {
        if (!r.userId) return;

        const percentage = r.totalQuestions > 0
          ? Math.round((r.score / (r.totalQuestions * 5)) * 100)
          : 0;

        if (!leaderboardMap[r.userId._id]) {
          leaderboardMap[r.userId._id] = {
            user: r.userId._id,
            fullName: r.userId.fullName || "Unknown",
            score: r.score || 0,
            percentage,
          };
        }
      });

      const leaderboardData = Object.values(leaderboardMap).sort(
        (a, b) => b.score - a.score
      );

      return { contest, leaderboard: leaderboardData };
    }

    const maxScore = contest.questions.length * 5;
    const leaderboardData = (leaderboard?.data || []).map((entry) => ({
      ...entry,
      totalQuestions: contest.questions.length,
      maxScore: maxScore,
      percentage: maxScore > 0 ? Math.round((entry.score / maxScore) * 100) : 0,
    }));

    return { contest, leaderboard: leaderboardData, maxScore };
  };

  const data = await cachedFetch(cacheKey, fetchSpecificLeaderboard, CACHE_TTL.LEADERBOARD);

  return res.status(200).json(
    new APIRES(200, data, data.contest ? "Leaderboard fetched" : "Contest not found or not completed")
  );
});

export { getLeaderboard, getContestLeaderboard };
