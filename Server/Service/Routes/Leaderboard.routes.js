import { Router } from "express";
import { getLeaderboard } from "../../Admin/Controllers/Leaderboard.controllers.js";

const leaderboardRouter = Router();

leaderboardRouter.route("/leaderboard").get(getLeaderboard);

export default leaderboardRouter;
