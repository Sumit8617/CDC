import { Router } from "express";
import {
  fetchContestDetails,
  fetchPreviousQuestions,
} from "../Controllers/TestDetails.controller.js";
import { getUpcomingContests, getShuffledQuestions } from "../Controllers/UpcomingContest.controller.js";
import { checkUserSubmission } from "../Controllers/CheckSubmission.controller.js";
import { protectRoute } from "../../Middleware/Auth.middleware.js";

const contestDetailsRouter = Router();

contestDetailsRouter.route("/contest-details").get(fetchContestDetails);
contestDetailsRouter
  .route("/previous-contest-questions/:id")
  .get(fetchPreviousQuestions);
contestDetailsRouter
  .route("/upcoming-contests")
  .get(protectRoute, getUpcomingContests);
contestDetailsRouter
  .route("/shuffled-questions/:contestId")
  .get(protectRoute, getShuffledQuestions);
contestDetailsRouter
  .route("/check-submission/:contestId")
  .get(protectRoute, checkUserSubmission);

export default contestDetailsRouter;
