import { Router } from "express";
import { createTest } from "../Controllers/Test.controller.js";
import { checkingCorrectness } from "../Controllers/Question.controller.js";

const adminRouter = Router();

adminRouter.route("/create-contest").post(createTest);
adminRouter.route("/check-answer").post(checkingCorrectness);

export default adminRouter;
