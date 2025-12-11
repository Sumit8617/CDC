import { Router } from "express";
import {
  adminLogin,
  getUser,
  getAdmin,
  getContest,
  adminInvite,
  verifyAdminInvite,
  registerAdmin,
} from "../Controllers/Auth.controller.js";
import { deleteUser } from "../Controllers/User.controller.js";
import { protectRoute } from "../../Middleware/Auth.middleware.js";

const adminAuthRoute = Router();

adminAuthRoute.route("/login").post(adminLogin);
adminAuthRoute.route("/invite").post(protectRoute, adminInvite);
adminAuthRoute.route("/verify").get(verifyAdminInvite);
adminAuthRoute.route("/register").post(registerAdmin);
adminAuthRoute.route("/delete-user/:userId").delete(deleteUser);
adminAuthRoute.route("/get-user").get(protectRoute, getUser);
adminAuthRoute.route("/get-admin").get(protectRoute, getAdmin);
adminAuthRoute.route("/get-contest").get(protectRoute, getContest);

export { adminAuthRoute };
