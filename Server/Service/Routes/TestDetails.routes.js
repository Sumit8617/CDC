import { Router } from "express";
import {
  fetchContestDetails,
  fetchPreviousQuestions,
} from "../Controllers/TestDetails.controller.js";
import {
  getUpcomingContests,
  getShuffledQuestions,
} from "../Controllers/UpcomingContest.controller.js";
import { checkUserSubmission } from "../Controllers/CheckSubmission.controller.js";
import { protectRoute } from "../../Middleware/Auth.middleware.js";

const contestDetailsRouter = Router();

contestDetailsRouter
  .get("/contest-details", fetchContestDetails)
  .get("/previous-contest-questions/:id", fetchPreviousQuestions)
  .get("/upcoming-contests", protectRoute, getUpcomingContests)
  .get("/shuffled-questions/:contestId", protectRoute, getShuffledQuestions)
  .get("/check-submission/:contestId", protectRoute, checkUserSubmission);

export default contestDetailsRouter;
