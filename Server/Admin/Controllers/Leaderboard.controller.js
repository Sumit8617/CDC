import mongoose from "mongoose";
import { asynchandler, APIRES, APIERR } from "../../Utils/index.utils.js";
import { Leaderboard } from "../Models/Leaderboard.models.js";
import { Test } from "../Models/Contest.model.js";

const getLeaderboard = asynchandler(async (req, res) => {
  // Find the most recent completed contest (past date & published)
  const recentContest = await Test.findOne({
    date: { $lte: new Date() }, // Contest date is in the past
    isPublished: true,
    status: "completed",
  })

    .sort({ date: -1 }) // Most recent first
    .lean();

  if (!recentContest) {
    return res.status(404).json(new APIERR(404, "No completed contest found"));
  }

  // Find leaderboard for that contest
  const leaderboard = await Leaderboard.findOne({
    contest: new mongoose.Types.ObjectId(recentContest._id),
  }).lean();

  console.log("Leaderboard fetched for contest:", recentContest._id);
  console.log("Leaderboard data:", leaderboard);

  if (!leaderboard) {
    return res
      .status(404)
      .json(new APIERR(404, "Leaderboard not found or not published yet"));
  }

  return res.status(200).json(
    new APIRES(
      200,
      {
        contest: recentContest,
        leaderboard: leaderboard.data,
      },
      "Leaderboard fetched successfully"
    )
  );
});

export { getLeaderboard };
