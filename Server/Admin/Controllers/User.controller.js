import { Block } from "../Models/BlockSchema.models.js";
import { User } from "../../Service/Models/User.models.js";
import { APIERR, APIRES, asynchandler } from "../../Utils/index.utils.js";
import { invalidateCache, CACHE_KEYS } from "../../Utils/RedisCache.utils.js";
import jwt from "jsonwebtoken";

// TODO: After Release features of blocking user operations
const blockUser = asynchandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  const { userId } = req.params;
  console.log("Coming from Backend", userId);
  if (!token || !userId) {
    throw new APIERR(404, "Please provide the required fields");
  }

  let blocker;
  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    blocker = decoded.id;
  } catch (error) {
    console.log("Err While verifying the token", error);
  }

  try {
    await Block.findOneAndUpdate(
      { blocker, blocked: userId },
      { blocker, blocked: userId },
      { upsert: true, new: true }
    );

    // Invalidate blocked user's cache
    await invalidateCache(`${CACHE_KEYS.USER_STATS}${userId}*`);
    await invalidateCache(`${CACHE_KEYS.USER_DASHBOARD}${userId}*`);
  } catch (error) {
    throw new APIERR(502, "Internal Server Error While Blocking the User");
  }

  res.status(200).json(new APIRES(200, "User Block Successfully"));
});

// TODO: After Release features of blocking user operations
const unblockUser = asynchandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  const { userId } = req.params;

  if (!token || !userId) {
    throw new APIERR(404, "Please provide the required fields");
  }

  let unblocker;
  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    unblocker = decoded.id;
  } catch (error) {
    console.log("Err While verifying the token", error);
  }

  try {
    await Block.deleteOne({ blocker: unblocker, blocked: userId });

    // Clear user cache after unblocking
    await invalidateCache(`${CACHE_KEYS.USER_STATS}${userId}*`);
    await invalidateCache(`${CACHE_KEYS.USER_DASHBOARD}${userId}*`);
  } catch (error) {
    throw new APIERR(502, "Internal Server Error While Unblocking the User");
  }

  res.status(200).json(new APIRES(200, "User Unblocked Successfully"));
});

// Get list of blocked users
const getBlockUser = asynchandler(async (req, res) => {
  const token = req.cookies?.refreshToken;

  if (!token) {
    throw new APIERR(401, "Unauthorized");
  }

  let userId;
  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    userId = decoded.id;
  } catch (error) {
    throw new APIERR(401, "Invalid token");
  }

  const blockedUsers = await Block.find({ blocker: userId }).populate("blocked", "fullName email");

  res.status(200).json(new APIRES(200, blockedUsers, "Blocked users fetched"));
});

const deleteUser = asynchandler(async (req, res) => {
  const { userId } = req.params;
  console.log("Coming from Body", userId);
  if (!userId) throw new APIERR(404, "Please provide the User id");
  const user = await User.findById(userId);
  if (!user) throw new APIERR(404, "User not found");

  try {
    await user.deleteOne();

    // Invalidate deleted user's cache
    await invalidateCache(`${CACHE_KEYS.USER_STATS}${userId}*`);
    await invalidateCache(`${CACHE_KEYS.USER_DASHBOARD}${userId}*`);
  } catch (error) {
    console.log("Error While Deleting the User from DataBase", error);
  }

  res.status(200).json(new APIRES(200, "Successfully delete the User"));
});

export { blockUser, unblockUser, getBlockUser, deleteUser };
