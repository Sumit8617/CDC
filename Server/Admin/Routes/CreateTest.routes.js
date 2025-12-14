import { Router } from "express";
import { adminOnly } from "../../Middleware/Auth.middleware.js";
import {
  createTest,
  getContest,
  updateContest,
  deleteContest,
  saveDraftContest,
} from "../Controllers/Test.controller.js";

const adminRouter = Router();

adminRouter.route("/create-contest").post(adminOnly, createTest);
adminRouter.route("/save-draft-contest").post(adminOnly, saveDraftContest);
adminRouter.route("/get-contest").get(adminOnly, getContest);
adminRouter.route("/update-contest/:contestId").put(adminOnly, updateContest);
adminRouter
  .route("/delete-contest/:contestId")
  .delete(adminOnly, deleteContest);

export default adminRouter;
