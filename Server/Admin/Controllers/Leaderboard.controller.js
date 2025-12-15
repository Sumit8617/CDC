import mongoose from "mongoose";
import { asynchandler, APIRES, APIERR } from "../../Utils/index.utils.js";
import { Leaderboard } from "../Models/Leaderboard.models.js";
import { Test } from "../Models/Contest.model.js";

const getLeaderboard = asynchandler(async (req, res) => {
  // Find most recent completed contest
  const recentContest = await Test.findOne({
    date: { $lte: new Date() },
    isPublished: true,
    status: "completed",
  })
    .sort({ date: -1 })
    .lean();

  // NO CONTEST YET → return empty success
  if (!recentContest) {
    return res.status(200).json(
      new APIRES(
        200,
        {
          contest: null,
          leaderboard: [],
        },
        "No completed contest available yet"
      )
    );
  }

  // Find leaderboard for that contest
  const leaderboard = await Leaderboard.findOne({
    contest: new mongoose.Types.ObjectId(recentContest._id),
  }).lean();

  // LEADERBOARD NOT PUBLISHED YET
  if (!leaderboard || !Array.isArray(leaderboard.data)) {
    return res.status(200).json(
      new APIRES(
        200,
        {
          contest: recentContest,
          leaderboard: [],
        },
        "Leaderboard not published yet"
      )
    );
  }

  //  SUCCESS
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
