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
import {
  blockUser,
  unblockUser,
  getBlockedUsers,
  deleteUser,
} from "../Controllers/User.controller.js";
import { adminOnly, protectRoute } from "../../Middleware/Auth.middleware.js";

const adminAuthRoute = Router();

adminAuthRoute
  .post("/login", adminLogin)
  .post("/invite", protectRoute, adminOnly, adminInvite)
  .get("/verify", verifyAdminInvite)
  .post("/register", registerAdmin)
  .delete("/delete-user/:userId", protectRoute, adminOnly, deleteUser)
  .post("/block-user/:userId", protectRoute, adminOnly, blockUser)
  .post("/unblock-user/:userId", protectRoute, adminOnly, unblockUser)
  .get("/blocked-users", protectRoute, adminOnly, getBlockedUsers)
  .get("/get-user", protectRoute, adminOnly, getUser)
  .get("/get-admin", protectRoute, adminOnly, getAdmin)
  .get("/get-contest", protectRoute, adminOnly, getContest);

export { adminAuthRoute };
