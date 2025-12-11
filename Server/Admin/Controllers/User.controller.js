import { Block } from "../Models/BlockSchema.models.js";
import { User } from "../../Service/Models/User.models.js";
import { APIERR, APIRES, asynchandler } from "../../Utils/index.utils.js";
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
  } catch (error) {
    throw new APIERR(502, "Internal Server Error While Blocking the User");
  }

  res.status(200).json(new APIRES(200, "User Block Successfully"));
});

// TODO: After Release features of blocking user operations
const unblockUser = asynchandler(async (req, res) => {});

// TODO: After Release features of blocking user operations
const getBlockUser = asynchandler(async (req, res) => {});

const deleteUser = asynchandler(async (req, res) => {
  const { userId } = req.params;
  console.log("Coming from Body", userId);
  if (!userId) throw new APIERR(404, "Please provide the User id");
  const user = await User.findById(userId);
  if (!user) throw new APIERR(404, "User not found");

  try {
    await user.deleteOne();
  } catch (error) {
    console.log("Error While Deleting the User from DataBase", error);
  }

  res.status(200).json(new APIRES(200, "Successfully delete the User"));
});

export { blockUser, unblockUser, getBlockUser, deleteUser };