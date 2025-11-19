import { Router } from "express";
import {
  adminLogin,
  getUser,
  getAdmin,
  getContest,
} from "../Controllers/Auth.controller.js";

const adminAuthRoute = Router();

adminAuthRoute.route("/login").post(adminLogin);
adminAuthRoute.route("/get-user").get(getUser);
adminAuthRoute.route("/get-admin").get(getAdmin);
adminAuthRoute.route("/get-contest").get(getContest);

export { adminAuthRoute };
