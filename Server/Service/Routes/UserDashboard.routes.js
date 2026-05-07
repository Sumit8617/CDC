import express from "express";
import { protectRoute } from "../../Middleware/Auth.middleware.js";
import {
  getUserStats,
  getUserPerformance,
  getUpcomingContests,
  getRecentHistory,
} from "../Controllers/UserDashboard.controller.js";

const router = express.Router();

router.get("/stats", protectRoute, getUserStats);
router.get("/performance", protectRoute, getUserPerformance);
router.get("/upcoming-contests", protectRoute, getUpcomingContests);
router.get("/recent-history", protectRoute, getRecentHistory);

export default router;