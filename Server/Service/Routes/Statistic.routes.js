import { Router } from "express";
import {
  getTotalContest,
  getTotalUser,
} from "../Controllers/Statistics.controller.js";

const viewersRouter = Router();

viewersRouter.route("/get-total-user").get(getTotalUser);
viewersRouter.route("/get-total-contest").get(getTotalContest);

export default viewersRouter;
