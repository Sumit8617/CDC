import { Router } from "express";
import { adminOnly, protectRoute } from "../../Middleware/Auth.middleware.js";
import {
  createTest,
  getContest,
  updateContest,
  deleteContest,
  saveDraftContest,
} from "../Controllers/Test.controller.js";

const adminRouter = Router();

adminRouter.route("/create-contest").post(protectRoute, adminOnly, createTest);
adminRouter
  .route("/save-draft-contest")
  .post(protectRoute, adminOnly, saveDraftContest);
adminRouter.route("/get-contest").get(protectRoute, adminOnly, getContest);
adminRouter
  .route("/update-contest/:contestId")
  .put(protectRoute, adminOnly, updateContest);
adminRouter
  .route("/delete-contest/:contestId")
  .delete(protectRoute, adminOnly, deleteContest);

export default adminRouter;
