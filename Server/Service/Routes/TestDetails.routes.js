import { Router } from "express";
import {
  fetchContestDetails,
  fetchPreviousQuestions,
} from "../Controllers/TestDetails.controller.js";
import { getUpcomingContests } from "../Controllers/UpcomingContest.controller.js";
import { protectRoute } from "../../Middleware/Auth.middleware.js";
// TODO: Add the protectRoute middleware when authentication is set up
const contestDetailsRouter = Router();

contestDetailsRouter.route("/contest-details").get(fetchContestDetails);
contestDetailsRouter
  .route("/previous-contest-questions/:id")
  .get(fetchPreviousQuestions);
contestDetailsRouter
  .route("/upcoming-contests")
  .get(protectRoute, getUpcomingContests);

export default contestDetailsRouter;
