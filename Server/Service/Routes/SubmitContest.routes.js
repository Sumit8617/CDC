import { Router } from "express";
import { submitContest } from "../Controllers/SubmitContest.controllers.js";

const submitContestResponse = Router();
submitContestResponse.route("/submit-contest").post(submitContest);

export default submitContestResponse;
