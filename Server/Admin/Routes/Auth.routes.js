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
import { adminOnly, protectRoute } from "../../Middleware/Auth.middleware.js";

const adminAuthRoute = Router();

adminAuthRoute.route("/login").post(adminLogin);
adminAuthRoute.route("/invite").post(protectRoute, adminOnly, adminInvite);
adminAuthRoute.route("/verify").get(verifyAdminInvite);
adminAuthRoute.route("/register").post(protectRoute, adminOnly, registerAdmin);
adminAuthRoute
  .route("/delete-user/:userId")
  .delete(protectRoute, adminOnly, deleteUser);
adminAuthRoute.route("/get-user").get(protectRoute, adminOnly, getUser);
adminAuthRoute.route("/get-admin").get(protectRoute, adminOnly, getAdmin);
adminAuthRoute.route("/get-contest").get(protectRoute, adminOnly, getContest);

export { adminAuthRoute };
