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
import { adminOnly } from "../../Middleware/Auth.middleware.js";

const adminAuthRoute = Router();

adminAuthRoute.route("/login").post(adminLogin);
adminAuthRoute.route("/invite").post(adminOnly, adminInvite);
adminAuthRoute.route("/verify").get(verifyAdminInvite);
adminAuthRoute.route("/register").post(registerAdmin);
adminAuthRoute.route("/delete-user/:userId").delete(adminOnly, deleteUser);
adminAuthRoute.route("/get-user").get(adminOnly, getUser);
adminAuthRoute.route("/get-admin").get(adminOnly, getAdmin);
adminAuthRoute.route("/get-contest").get(adminOnly, getContest);

export { adminAuthRoute };
