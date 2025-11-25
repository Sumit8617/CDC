import { Router } from "express";
import { getLeaderboard } from "../../Admin/Controllers/Leaderboard.controller.js";

const leaderboardRouter = Router();

leaderboardRouter.route("/leaderboard").get(getLeaderboard);

export default leaderboardRouter;
