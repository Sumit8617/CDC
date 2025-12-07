import { Router } from "express";
import {
  adminLogin,
  getUser,
  getAdmin,
  getContest,
  adminInvite,
  verifyAdminInvite,
} from "../Controllers/Auth.controller.js";
import { protectRoute } from "../../Middleware/Auth.middleware.js";

const adminAuthRoute = Router();

adminAuthRoute.route("/login").post(adminLogin);
adminAuthRoute.route("/invite").post(adminInvite);
adminAuthRoute.route("/verify").post(verifyAdminInvite);
adminAuthRoute.route("/get-user").get(protectRoute, getUser);
adminAuthRoute.route("/get-admin").get(protectRoute, getAdmin);
adminAuthRoute.route("/get-contest").get(protectRoute, getContest);

export { adminAuthRoute };
