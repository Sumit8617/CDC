import express from 'express'
import { protectRoute } from '../middleware/authMiddleware.js'
import { createQuiz,getAllQuiz,getQuiz,deleteQuiz,getMyQuiz, updateQuiz } from '../controllers/quizControllers.js'

const router = express.Router()

router.post("/create",protectRoute, createQuiz)
router.get("/",getAllQuiz) // todo: add protection
router.get("/my",protectRoute,getMyQuiz)
router.get("/:id", protectRoute, getQuiz) 
router.patch("/update/:id",protectRoute,updateQuiz)
router.delete("/delete/:id",protectRoute,deleteQuiz)

export default router