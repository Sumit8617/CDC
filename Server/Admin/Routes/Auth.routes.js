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
import { blockUser, unblockUser, getBlockUser, deleteUser } from "../Controllers/User.controller.js";
import { adminOnly, protectRoute } from "../../Middleware/Auth.middleware.js";

const adminAuthRoute = Router();

adminAuthRoute.post("/login", adminLogin);
adminAuthRoute.post("/invite", protectRoute, adminOnly, adminInvite);
adminAuthRoute.get("/verify", verifyAdminInvite);
adminAuthRoute.post("/register", registerAdmin);
adminAuthRoute.delete(
  "/delete-user/:userId",
  protectRoute,
  adminOnly,
  deleteUser
);
adminAuthRoute.post(
  "/block-user/:userId",
  protectRoute,
  adminOnly,
  blockUser
);
adminAuthRoute.post(
  "/unblock-user/:userId",
  protectRoute,
  adminOnly,
  unblockUser
);
adminAuthRoute.get(
  "/blocked-users",
  protectRoute,
  adminOnly,
  getBlockUser
);
adminAuthRoute.get("/get-user", protectRoute, adminOnly, getUser);
adminAuthRoute.get("/get-admin", protectRoute, adminOnly, getAdmin);
adminAuthRoute.get("/get-contest", protectRoute, adminOnly, getContest);

export { adminAuthRoute };
