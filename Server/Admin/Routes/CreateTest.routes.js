import { Router } from "express";
import { adminOnly, protectRoute } from "../../Middleware/Auth.middleware.js";
import {
  createTest,
  getContest,
  updateContest,
  deleteContest,
  saveDraftContest,
  parseQuestions,
} from "../Controllers/Test.controller.js";
import { upload, uploadWithImages } from "../../Middleware/Multer.middleware.js";

const adminRouter = Router();

// adminRouter.route("/create-contest").post(protectRoute, adminOnly, createTest);
adminRouter.route("/create-contest").post(createTest);
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

// Route for parsing PDF/Word files (original - no images)
adminRouter
  .route("/parse-questions")
  .post(upload.single("file"), parseQuestions);

// NEW: Route for parsing PDF/Word files with associated images
// Images should be uploaded as 'images' field in same order as [Image] markers
adminRouter
  .route("/parse-questions-with-images")
  .post(uploadWithImages, parseQuestions);

export default adminRouter;
