import { asynchandler, APIRES, APIERR } from "../../Utils/index.utils.js";
import { Leaderboard } from "../Models/Leaderboard.models.js";

const getLeaderboard = asynchandler(async (req, res) => {
  const { contestId } = req.body;

  const leaderboard = Leaderboard.findOne({
    contest: new mongoose.Types.ObjectId(contestId),
  });
  console.log(leaderboard);
  if (!leaderboard)
    return res
      .status(404)
      .json(new APIERR(404, "Leaderboard not found or not published yet"));

  res
    .status(200)
    .json(
      new APIRES(200, leaderboard.data, "Leaderboard fetched successfully")
    );
});

export { getLeaderboard };
