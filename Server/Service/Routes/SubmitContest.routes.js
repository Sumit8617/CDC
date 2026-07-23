import { Router } from "express";
import { submitContest } from "../Controllers/SubmitContest.controllers.js";
import { protectRoute } from "../../Middleware/Auth.middleware.js";

const submitContestResponse = Router();
submitContestResponse.post("/submit-contest", protectRoute, submitContest);

export default submitContestResponse;
