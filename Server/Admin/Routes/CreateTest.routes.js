import { Router } from "express";
import { protectRoute } from "../../Middleware/Auth.middleware.js";
import {
  createTest,
  getContest,
  updateContest,
  deleteContest,
  saveDraftContest,
} from "../Controllers/Test.controller.js";

const adminRouter = Router();

adminRouter.route("/create-contest").post(protectRoute, createTest);
adminRouter.route("/save-draft-contest").post(protectRoute, saveDraftContest);
adminRouter.route("/get-contest").get(protectRoute, getContest);
adminRouter
  .route("/update-contest/:contestId")
  .put(protectRoute, updateContest);
adminRouter
  .route("/delete-contest/:contestId")
  .delete(protectRoute, deleteContest);

export default adminRouter;
