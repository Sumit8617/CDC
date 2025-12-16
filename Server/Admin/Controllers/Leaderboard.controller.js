import mongoose from "mongoose";
import { asynchandler, APIRES } from "../../Utils/index.utils.js";
import { Leaderboard } from "../Models/Leaderboard.models.js";
import { Test } from "../Models/Contest.model.js";

const getLeaderboard = asynchandler(async (req, res) => {
  const contest = await Test.findOne({
    status: "completed",
    isPublished: true,
  })
    .sort({ date: -1 })
    .lean();

  if (!contest) {
    return res
      .status(200)
      .json(
        new APIRES(
          200,
          { contest: null, leaderboard: [] },
          "No completed contest"
        )
      );
  }

  const leaderboard = await Leaderboard.findOne({
    contest: contest._id,
  }).lean();

  return res.status(200).json(
    new APIRES(
      200,
      {
        contest,
        leaderboard: leaderboard?.data || [],
      },
      leaderboard ? "Leaderboard fetched" : "Leaderboard not published yet"
    )
  );
});

export { getLeaderboard };
