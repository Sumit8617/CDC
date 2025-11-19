import { Router } from "express";
import { createTest } from "../Controllers/Test.controller.js";

const adminRouter = Router();

adminRouter.route("/create-contest").post(createTest);

export default adminRouter;
