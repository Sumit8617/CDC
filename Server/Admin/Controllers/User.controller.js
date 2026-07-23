import { Block } from "../Models/BlockSchema.models.js";
import { User } from "../../Service/Models/User.models.js";
import { APIERR, APIRES, asynchandler, sendMail } from "../../Utils/index.utils.js";
import { invalidateCache, CACHE_KEYS } from "../../Utils/RedisCache.utils.js";

// Block a user (admin only)
const blockUser = asynchandler(async (req, res) => {
  const { userId } = req.params;
  const blocker = req.user._id;

  if (!userId) {
    throw new APIERR(400, "User ID is required");
  }

  if (blocker.toString() === userId) {
    throw new APIERR(400, "You cannot block yourself");
  }

  // Check if user exists
  const userToBlock = await User.findById(userId);
  if (!userToBlock) {
    throw new APIERR(404, "User not found");
  }

  // Check if already blocked
  const existingBlock = await Block.findOne({ blocker, blocked: userId });
  if (existingBlock) {
    throw new APIERR(400, "User is already blocked");
  }

  await Block.create({ blocker, blocked: userId });

  // Invalidate blocked user's cache
  await invalidateCache(`${CACHE_KEYS.USER_STATS}${userId}*`);
  await invalidateCache(`${CACHE_KEYS.USER_DASHBOARD}${userId}*`);

  // Also invalidate the all users cache to reflect the blocked status
  await invalidateCache(`${CACHE_KEYS.USER_STATS}admin:all*`);

  // Send email notification to the blocked user
  const blockEmailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
      <div style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">

        <!-- Header -->
        <div style="background-color: #dc2626; padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 26px;">${process.env.APP_NAME}</h1>
        </div>

        <!-- Body -->
        <div style="padding: 30px;">
          <h2 style="color: #333333; font-size: 22px;">Account Blocked</h2>
          <p style="color: #555555; font-size: 15px; line-height: 1.7;">
            Dear <strong>${userToBlock.fullName}</strong>,
          </p>
          <p style="color: #555555; font-size: 15px; line-height: 1.7;">
            We regret to inform you that your account on <strong>${process.env.APP_NAME}</strong> has been blocked by an administrator.
          </p>

          <!-- Block Details Box -->
          <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; border-radius: 6px; padding: 16px; margin: 20px 0;">
            <p style="margin: 6px 0; color: #444; font-size: 14px;"><strong>Email:</strong> ${userToBlock.email}</p>
            <p style="margin: 6px 0; color: #444; font-size: 14px;"><strong>Blocked On:</strong> ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
          </div>

          <p style="color: #555555; font-size: 15px; line-height: 1.7;">
            If you believe this was done in error or would like to dispute this action, please contact the administrator.
          </p>

          <p style="color: #555555; font-size: 15px; line-height: 1.7;">
            You can reach us at:
            <a href="mailto:${process.env.SMTP_FROM_EMAIL}" style="color: #dc2626; text-decoration: none;">
              ${process.env.SMTP_FROM_EMAIL}
            </a>
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f0f0f0; padding: 20px; text-align: center;">
          <p style="color: #999999; font-size: 12px; margin: 0;">
            © ${new Date().getFullYear()} ${process.env.APP_NAME}. All rights reserved.
          </p>
        </div>

      </div>
    </div>
  `;

  try {
    await sendMail(
      userToBlock.email,
      `Your ${process.env.APP_NAME} Account Has Been Blocked`,
      blockEmailHtml
    );
    console.log(`Block notification email sent to ${userToBlock.email}`);
  } catch (error) {
    console.log("ERROR While Sending block notification email", error);
  }

  res.status(200).json(new APIRES(200, "User blocked successfully"));
});

// Unblock a user (admin only)
const unblockUser = asynchandler(async (req, res) => {
  const { userId } = req.params;
  const unblocker = req.user._id;

  if (!userId) {
    throw new APIERR(400, "User ID is required");
  }

  // Find the user to unblock
  const userToUnblock = await User.findById(userId);
  if (!userToUnblock) {
    throw new APIERR(404, "User not found");
  }

  const existingBlock = await Block.findOne({ blocker: unblocker, blocked: userId });
  if (!existingBlock) {
    throw new APIERR(400, "User is not blocked");
  }

  await Block.deleteOne({ blocker: unblocker, blocked: userId });

  // Clear user cache after unblocking
  await invalidateCache(`${CACHE_KEYS.USER_STATS}${userId}*`);
  await invalidateCache(`${CACHE_KEYS.USER_DASHBOARD}${userId}*`);
  // Also invalidate the all users cache to reflect the unblocked status
  await invalidateCache(`${CACHE_KEYS.USER_STATS}admin:all*`);

  // Send email notification to the unblocked user
  const unblockEmailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
      <div style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">

        <!-- Header -->
        <div style="background-color: #10b981; padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 26px;">${process.env.APP_NAME}</h1>
        </div>

        <!-- Body -->
        <div style="padding: 30px;">
          <h2 style="color: #333333; font-size: 22px;">Account Unblocked</h2>
          <p style="color: #555555; font-size: 15px; line-height: 1.7;">
            Dear <strong>${userToUnblock.fullName}</strong>,
          </p>
          <p style="color: #555555; font-size: 15px; line-height: 1.7;">
            Great news! Your account on <strong>${process.env.APP_NAME}</strong> has been unblocked by an administrator.
          </p>

          <!-- Unblock Details Box -->
          <div style="background-color: #ecfdf5; border-left: 4px solid #10b981; border-radius: 6px; padding: 16px; margin: 20px 0;">
            <p style="margin: 6px 0; color: #444; font-size: 14px;"><strong>Email:</strong> ${userToUnblock.email}</p>
            <p style="margin: 6px 0; color: #444; font-size: 14px;"><strong>Unblocked On:</strong> ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
          </div>

          <p style="color: #555555; font-size: 15px; line-height: 1.7;">
            You can now log in to your account and access all features as before.
          </p>

          <p style="color: #555555; font-size: 15px; line-height: 1.7;">
            If you have any questions, please contact the administrator.
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f0f0f0; padding: 20px; text-align: center;">
          <p style="color: #999999; font-size: 12px; margin: 0;">
            © ${new Date().getFullYear()} ${process.env.APP_NAME}. All rights reserved.
          </p>
        </div>

      </div>
    </div>
  `;

  try {
    await sendMail(
      userToUnblock.email,
      `Your ${process.env.APP_NAME} Account Has Been Unblocked`,
      unblockEmailHtml
    );
    console.log(`Unblock notification email sent to ${userToUnblock.email}`);
  } catch (error) {
    console.log("ERROR While Sending unblock notification email", error);
  }

  res.status(200).json(new APIRES(200, "User unblocked successfully"));
});

// Get list of blocked users (admin only)
const getBlockedUsers = asynchandler(async (req, res) => {
  const userId = req.user._id;

  const blockedUsers = await Block.find({ blocker: userId })
    .populate("blocked", "fullName email rollNumber")
    .lean();

  const formatted = blockedUsers.map((block) => ({
    _id: block._id,
    blockedUser: block.blocked,
    blockedAt: block.createdAt,
  }));

  res.status(200).json(new APIRES(200, { blockedUsers: formatted, total: formatted.length }, "Blocked users fetched"));
});

// Delete a user (admin only)
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

export { blockUser, unblockUser, getBlockedUsers, deleteUser };
