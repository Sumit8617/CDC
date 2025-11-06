import express from 'express'
import { getLeaderboard, submitResult, getMyResult } from '../controllers/resultControllers.js'
import { protectRoute } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get("/my/:quizId",protectRoute,getMyResult) 
router.get("leaderboard/:quizId",getLeaderboard)
router.post("submit/:quizId",protectRoute, submitResult)


export default router