import { Router } from "express";
import {
  getLeaderboard,
  getContestLeaderboard,
} from "../../Admin/Controllers/Leaderboard.controller.js";
import { protectRoute } from "../../Middleware/Auth.middleware.js";

const leaderboardRouter = Router();

leaderboardRouter
  .get("/leaderboard", protectRoute, getLeaderboard)
  .get("/leaderboard/:contestId", protectRoute, getContestLeaderboard);

export default leaderboardRouter;
