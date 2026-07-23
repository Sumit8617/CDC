import { Router } from "express";
import { adminOnly, protectRoute } from "../../Middleware/Auth.middleware.js";
import { blockUser, unblockUser, getBlockedUsers, deleteUser } from "../Controllers/User.controller.js";

const userRouter = Router();

// Block/Unblock routes (admin only)
userRouter.route("/users/:userId/block").post(protectRoute, adminOnly, blockUser);
userRouter.route("/users/:userId/unblock").post(protectRoute, adminOnly, unblockUser);
userRouter.route("/users/blocked").get(protectRoute, adminOnly, getBlockedUsers);
userRouter.route("/users/:userId").delete(protectRoute, adminOnly, deleteUser);

export default userRouter;
