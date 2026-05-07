import {
  asynchandler,
  APIERR,
  APIRES,
  sendMail,
} from "../../Utils/index.utils.js";
import { User } from "../../Service/Models/User.models.js";
import { Test } from "../Models/Contest.model.js";
import { Leaderboard } from "../Models/Leaderboard.models.js";
import { generateAccessAndRefreshTokens } from "../../Service/Controllers/Auth.controllers.js";
import { InviteToken } from "../Models/InviteTokenSchema.model.js";
import crypto from "crypto-js";

const adminLogin = asynchandler(async (req, res) => {
  const { email, mobileNumber, password } = req.body;
  if ([email, mobileNumber, password].some((f) => !f || f.trim() === "")) {
    throw new APIERR(400, "Please provide all the fields");
  }

  //   Find the existed user with admin role
  const existedUser = await User.findOne({ email, role: "admin" });

  if (!existedUser) {
    throw new APIERR(404, "Admin user with this email is not found");
  }

  //   Match the user Password
  const isPasswordCorrect = await existedUser.isPasswordValid(password);
  if (!isPasswordCorrect) {
    throw new APIERR(402, "Password is not Correct");
  }
  //   Generate TOkens
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    existedUser._id
  );

  if (!accessToken || !refreshToken) {
    throw new APIERR(502, "ERR While Generating the acess and refresh TOkens");
  }

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "none",
    maxAge: 5 * 60 * 60 * 1000,
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "none",
    maxAge: 5 * 60 * 60 * 1000,
  });

  res.status(200).json(
    new APIRES(
      200,
      {
        user: existedUser._id,
        role: existedUser.role,
        accessToken,
        refreshToken,
      },
      "Successfully logged in "
    )
  );
});

const adminInvite = asynchandler(async (req, res) => {
  const { fullName, email } = req.body;
  if (!fullName || !email) {
    throw new APIERR(400, "Please provide all the fields");
  }

  // Find that if the user already exist with this email and role
  const existedUser = await User.findOne({ email, role: "admin" });
  if (existedUser) {
    throw new APIERR(
      402,
      "User with this mail and role already exists. You can't invite them"
    );
  }

  // Create a TOken using Crypto
  const tokenSecretKey = process.env.CRYPTO_SECRET_KEY;
  const tokenPayload = `${email}-${Date.now()}`;
  const token = crypto.AES.encrypt(tokenPayload, tokenSecretKey).toString();

  // Save the token in DB
  const savedToken = await InviteToken.create({
    fullName,
    email,
    token,
    role: "admin",
  });
  console.log(savedToken);

  // Create the Invite link for the User
  const inviteLink = `${process.env.FRONTEND_URL}/admin/register?token=${encodeURIComponent(
    token
  )}`;

  // Admin invite email HTML
  const adminInviteHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
      <div style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">

        <!-- Header -->
        <div style="background-color: orange; padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 26px;">${process.env.APP_NAME}</h1>
        </div>

        <!-- Body -->
        <div style="padding: 30px;">
          <h2 style="color: #333333; font-size: 22px;">Hello, ${fullName}!</h2>
          <p style="color: #555555; font-size: 15px; line-height: 1.7;">
            You have been invited to join <strong>${process.env.APP_NAME}</strong> as an 
            <strong>Admin</strong>. Click the button below to complete your registration.
          </p>

          <!-- Invite Details Box -->
          <div style="background-color: #f9f9f9; border-left: 4px solid orange; border-radius: 6px; padding: 16px; margin: 20px 0;">
            <p style="margin: 6px 0; color: #444; font-size: 14px;"><strong>Name:</strong> ${fullName}</p>
            <p style="margin: 6px 0; color: #444; font-size: 14px;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 6px 0; color: #444; font-size: 14px;"><strong>Role:</strong> Admin</p>
            <p style="margin: 6px 0; color: #444; font-size: 14px;"><strong>Expires In:</strong> 24 hours</p>
          </div>

          <!-- CTA Button -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${inviteLink}"
              style="background-color: orange; color: #ffffff; padding: 14px 32px;
                     text-decoration: none; border-radius: 6px; font-size: 15px; font-weight: bold;">
              Accept Invitation
            </a>
          </div>

          <p style="color: #555555; font-size: 15px; line-height: 1.7;">
            If the button doesn't work, copy and paste the link below into your browser:
          </p>
          <p style="word-break: break-all; color: orange; font-size: 13px;">
            ${inviteLink}
          </p>

          <p style="color: #555555; font-size: 15px; line-height: 1.7;">
            If you did not expect this invitation, please contact us at  
            <a href="mailto:${process.env.SUPPORT_EMAIL}" style="color: orange; text-decoration: none;">
              ${process.env.SMTP_FROM_EMAIL}
            </a>.
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
      email,
      `You're invited to join ${process.env.APP_NAME} as Admin`,
      adminInviteHtml
    );
    console.log("Successfully Sent the Mail");
  } catch (error) {
    console.log("ERROR While Sending the admin invite mail", error);
  }

  // Sent the Data
  res
    .status(200)
    .json(
      new APIRES(
        200,
        inviteLink,
        "Successfully Create the Token for admin Invite"
      )
    );
});

const verifyAdminInvite = asynchandler(async (req, res) => {
  const token = decodeURIComponent(req.query.token);

  if (!token) throw new APIERR(400, "Token missing");

  // Find token in DB and ensure it's not expired
  const invite = await InviteToken.findOne({
    token,
    createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  });

  if (!invite) throw new APIERR(404, "Invalid or expired token");

  const existedUser = await User.findOne({ email: invite.email });
  if (existedUser) throw new APIERR(400, "User already exists");

  res.status(200).json(
    new APIRES(
      200,
      {
        email: invite.email,
        fullName: invite.fullName,
        role: invite.role,
      },
      "Valid token"
    )
  );
});
// TODO: Sent the welcome mail to the Admin
const registerAdmin = asynchandler(async (req, res) => {
  const { token, mobileNumber, rollNumber, dob, password, confirmPassword } =
    req.body;

  console.log("Incoming body =>", req.body);

  if (!password || !confirmPassword) {
    throw new APIERR(400, "Password and Confirm Password are required");
  }

  if (password !== confirmPassword) {
    throw new APIERR(400, "Password and Confirm Password must match");
  }

  if (password.length < 6) {
    throw new APIERR(400, "Password must be at least 6 characters");
  }

  // Find invite token and ensure it's valid
  const invite = await InviteToken.findOne({
    token,
    createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  });

  if (!invite) throw new APIERR(404, "Invalid or expired invite token");

  // Decrypt email if stored encrypted
  const email = invite.isEncrypted ? decryptEmail(invite.email) : invite.email;

  const fullName = invite.fullName;
  const role = "admin";
  console.log("Registering admin with email:", email);
  console.log("Full Name:", fullName);
  console.log("Role:", role);

  // Check if user already exists
  const existedUser = await User.findOne({ email });
  if (existedUser) throw new APIERR(400, "User already registered");

  // Create the Admin
  let createdAdmin;
  try {
    createdAdmin = await User.create({
      fullName,
      email,
      mobileNumber,
      rollNumber,
      role,
      dob,
      password,
    });

    console.log("Created Admin:", createdAdmin);
  } catch (error) {
    console.log("Error while creating admin:", error);
    throw new APIERR(500, "Error while creating admin");
  }

  // Delete the invite token after successful registration
  await InviteToken.deleteOne({ _id: invite._id });

  // Generate tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    createdAdmin._id
  );

  // Prepare user data without sensitive fields
  const sentCreatedAdmin = await User.findById(createdAdmin._id).select(
    "-password -refreshToken"
  );

  // Set cookies
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000,
  });

  // Return success
  res
    .status(200)
    .json(new APIRES(200, sentCreatedAdmin, "Admin registered successfully"));
});

// TODO: Some Bug fix if the user is empty it don't sent No user Found instead sending the status code and get failed
const getUser = asynchandler(async (req, res) => {
  const totalUsers = await User.countDocuments({ role: "user" });
  const userDetails = await User.find({ role: "user" })
    .select("-password -refreshToken -mobileNumber")
    .lean();

  res
    .status(200)
    .json(
      new APIRES(200, { totalUsers, userDetails }, "Successfully fetched users")
    );
});

const getAdmin = asynchandler(async (req, res) => {
  const totalAdmin = await User.countDocuments({ role: "admin" });
  const adminDetails = await User.find({ role: "admin" }).select(
    "-password -refreshToken"
  );

  return res.status(200).json(
    new APIRES(
      200,
      {
        totalAdmin: totalAdmin || 0,
        adminDetails: adminDetails || [],
      },
      totalAdmin === 0
        ? "No admins found"
        : "Successfully fetched the admin details"
    )
  );
});

const getContest = asynchandler(async (req, res) => {
  const totalContest = await Test.countDocuments().lean();
  const recentContests = await Test.find().sort({ createdAt: -1 }).lean();

  // If no contests exist
  if (totalContest === 0 || !recentContests || recentContests.length === 0) {
    return res.status(404).json(new APIRES(404, null, "No Contest Found"));
  }

  // Check which contests have their leaderboards published
  const leaderboardDocs = await Leaderboard.find({
    publishedAt: { $ne: null },
  }).lean();

  const publishedContestIds = new Set(
    leaderboardDocs.map((lb) => lb.contest.toString())
  );

  // Add isLeaderboardPublished to each contest
  const contestsWithLeaderboard = recentContests.map((contest) => ({
    ...contest,
    isLeaderboardPublished: publishedContestIds.has(contest._id.toString()),
  }));

  res
    .status(200)
    .json(
      new APIRES(
        200,
        { totalContest, recentContests: contestsWithLeaderboard },
        "Successfully fetched the total contest"
      )
    );
});

export {
  adminLogin,
  adminInvite,
  verifyAdminInvite,
  registerAdmin,
  getUser,
  getAdmin,
  getContest,
};
