import { asynchandler, APIERR, APIRES,AdminMail } from "../../Utils/index.utils.js";
import { User } from "../../Service/Models/User.models.js";
import { Test } from "../Models/Test.model.js";
import { generateAccessAndRefreshTokens } from "../../Service/Controllers/Auth.controllers.js";

const adminLogin = asynchandler(async (req, res) => {
  const { email, mobileNumber, password } = req.body;
  console.log("Coming From the Admin Login =>", email, mobileNumber, password);
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
    maxAge: 60 * 1000,
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "none",
    maxAge: 60 * 1000,
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

});

const getUser = asynchandler(async (req, res) => {
  const totalUsers = await User.countDocuments({ role: "user" });
  const userDetails = await User.find({ role: "user" }).select(
    "-password -refreshToken"
  );

  if (totalUsers.length === 0) {
    throw new APIERR(404, "No users found");
  }

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
  const totalContest = await Test.countDocuments();
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

export { adminLogin, adminInvite, getUser, getAdmin, getContest };
