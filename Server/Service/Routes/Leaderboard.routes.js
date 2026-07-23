import { Router } from "express";
import { getLeaderboard, getContestLeaderboard } from "../../Admin/Controllers/Leaderboard.controller.js";
import { protectRoute } from "../../Middleware/Auth.middleware.js";

const leaderboardRouter = Router();

leaderboardRouter.route("/leaderboard").get(protectRoute, getLeaderboard);
leaderboardRouter.route("/leaderboard/:contestId").get(protectRoute, getContestLeaderboard);

export default leaderboardRouter;
