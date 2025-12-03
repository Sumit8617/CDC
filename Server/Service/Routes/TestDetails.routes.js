import { Router } from "express";
import {
  fetchContestDetails,
  fetchPreviousQuestions,
} from "../Controllers/TestDetails.controller.js";

const contestDetailsRouter = Router();

contestDetailsRouter.route("/contest-details").get(fetchContestDetails);
contestDetailsRouter
  .route("/previous-contest-questions/:id")
  .get(fetchPreviousQuestions);

export default contestDetailsRouter;
