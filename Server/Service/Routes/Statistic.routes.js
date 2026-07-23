import { Router } from "express";
import {
  getTotalContest,
  getTotalUser,
} from "../Controllers/Statistics.controller.js";

const viewersRouter = Router();

viewersRouter
  .get("/get-total-user", getTotalUser)
  .get("/get-total-contest", getTotalContest);

export default viewersRouter;
