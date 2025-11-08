import express from "express";
import {
  getLeaderboard,
  submitResult,
  getMyResult,
} from "../Controllers/Result.controllers.js";
import { protectRoute } from "../Middleware/Auth.middleware.js";

const router = express.Router();

router.get("/my/:quizId", protectRoute, getMyResult);
router.get("leaderboard/:quizId", getLeaderboard);
router.post("submit/:quizId", protectRoute, submitResult);

export default router;
