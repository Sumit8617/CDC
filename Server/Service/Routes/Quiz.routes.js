import express from "express";
import { protectRoute } from "../../Middleware/Auth.middleware.js";
import {
  createQuiz,
  getAllQuiz,
  getQuiz,
  deleteQuiz,
  getMyQuiz,
  updateQuiz,
} from "../Controllers/Quiz.controllers.js";
import { createTest } from "../../Admin/Controllers/Test.controller.js";

const router = express.Router();

router.post("/create", protectRoute, createQuiz);
router.get("/", getAllQuiz); // todo: add protection
router.get("/my", protectRoute, getMyQuiz);
router.get("/:id", protectRoute, getQuiz);
router.patch("/update/:id", protectRoute, updateQuiz);
router.delete("/delete/:id", protectRoute, deleteQuiz);

router.route("/fetch-question").get(createTest);

export default router;
