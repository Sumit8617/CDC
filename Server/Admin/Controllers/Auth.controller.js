import { asynchandler, APIERR, APIRES } from "../../Utils/index.utils.js";
import { User } from "../../Service/Models/User.models.js";
import { Test } from "../Models/Contest.model.js";
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
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "none",
    maxAge: 5 * 60 * 60 * 1000,
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "none",
    maxAge: 5 * 60 * 60 * 1000,
  });

  res.status(200).json(
    new APIRES(
      200,
      {
        user: existedUser._id,
        role: existedUser.role,
      },
      "Successfully logged in "
    )
  );
});
// TODO: Add the Email Sending
const adminInvite = asynchandler(async (req, res) => {
  const { fullName, email } = req.body;
  console.log("Coming From the body =>", fullName, email);
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
  console.log("Generated Token is =>", token);

  // Sent the mail to the user

  // Save the token in DB
  const savedToken = await InviteToken.create({
    email,
    fullName,
    token,
    role: "admin",
  });

  // Create the Invite link for the User
  const inviteLink = `${process.env.FRONTEND_URL}/admin/register?token=${encodeURIComponent(
    token
  )}`;

  console.log("Admin Invite link is =>", inviteLink);

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

// TODO: add the Email Service here
const verifyAdminInvite = asynchandler(async (req, res) => {
  const { token } = req.body;
  if (!token) {
    throw new APIERR(404, "Token Not Found or Maybe Expire");
  }

  const tokenSecretKey = process.env.CRYPTO_SECRET_KEY;
  let email;
  try {
    const bytes = crypto.AES.decrypt(token, tokenSecretKey);
    const decrypted = (bytes.toString(crypto.enc.Utf8)[email] =
      decrypted.split("-"));
  } catch (error) {
    console.log("Error While Decrypting the Token", error);
    throw new APIERR(402, "Token Invalid");
  }

  // Check that the token is exist in the DB or not
  const existedToken = await InviteToken.findOne({ email, token });
  if (!existedToken) throw new APIERR(404, "Token Invalid or expired");

  // Check that if the user already existed with that user
  const existedUser = await User.findOne({ email });
  if (existedUser) throw new APIERR(402, "User with this mail already exist");

  const newAdmin = await User.create({ email, fullName, role: "admin" });
  console.log("New Admin Details =>", newAdmin);
  // Sent the Successfully Signup mail to the new Admin

  // Delete the Token after successfull signup
  await InviteToken.deleteOne({ _id: token._id });

  res.status(200).json(new APIRES(200, "Successfully Create the User"));
});

const getUser = asynchandler(async (req, res) => {
  // const { userId } = req.params;
  // if (!userId) {
  //   throw new APIERR(404, "User ID Not Found");
  // }
  const totalUsers = await User.countDocuments({ role: "user" });
  const userDetails = await User.find({ role: "user" })
    .select("-password -refreshToken")
    .lean();

  if (totalUsers === 0) {
    throw new APIERR(404, "No users found");
  }

  res
    .status(200)
    .json(
      new APIRES(200, { totalUsers, userDetails }, "Successfully fetched users")
    );
});

const getAdmin = asynchandler(async (req, res) => {
  const totalAdmin = await User.countDocuments({ role: "admin" }).lean();
  const adminDetails = await User.find({ role: "admin" }).select(
    "-password -refreshToken"
  );
  if (!totalAdmin || !adminDetails) {
    throw new APIERR(502, "Internal Server Error");
  }
  res
    .status(200)
    .json(
      new APIRES(
        200,
        { totalAdmin, adminDetails },
        "Successfully fetched the Admin Details"
      )
    );
});

const getContest = asynchandler(async (req, res) => {
  const totalContest = await Test.countDocuments().lean();
  const recentContests = await Test.find().sort({ createdAt: -1 }).lean();
  if (!totalContest || !recentContests) {
    throw new APIERR(502, "Internal Server Error");
  }

  res
    .status(200)
    .json(
      new APIRES(
        200,
        { totalContest, recentContests },
        "Successfully fetched the total contest"
      )
    );
});

export {
  adminLogin,
  adminInvite,
  verifyAdminInvite,
  getUser,
  getAdmin,
  getContest,
};
