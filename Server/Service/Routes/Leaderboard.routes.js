import { Router } from "express";
import { getLeaderboard } from "../../Admin/Controllers/Leaderboard.controller.js";
import { protectRoute } from "../../Middleware/Auth.middleware.js";

const leaderboardRouter = Router();

leaderboardRouter.route("/leaderboard").get(protectRoute, getLeaderboard);

export default leaderboardRouter;
