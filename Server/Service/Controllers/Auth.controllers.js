import jwt from "jsonwebtoken";
import { User } from "../Models/User.models.js";
import { SubmittedOption } from "../../Admin/Models/SubmitedOption.model.js";
import { Leaderboard } from "../../Admin/Models/Leaderboard.models.js";
import { Test } from "../../Admin/Models/Contest.model.js";
import {
  asynchandler,
  APIERR,
  APIRES,
  sendMail,
} from "../../Utils/index.utils.js";
import {
  cacheDelete,
  cacheDeletePattern,
} from "../../Utils/RedisCache.utils.js";
import { CACHE_KEYS } from "../../config/redis.config.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    await user.hashRefreshToken(refreshToken);
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    console.log("Err While Generating the Tokens", error);
    throw error;
  }
};

const signup = asynchandler(async (req, res) => {
  const { fullName, email, mobileNumber, password, role, rollNumber, dob } =
    req.body;

  if (
    [fullName, email, mobileNumber, password, role, rollNumber, dob].some(
      (f) => !f || String(f).trim() === ""
    )
  ) {
    throw new APIERR(400, "Please provide the required fields");
  }

  if (password.length < 6) {
    throw new APIERR(400, "Password length must be 6");
  }

  const existeduser = await User.findOne({ mobileNumber });
  if (existeduser) {
    throw new APIERR(400, "User already exist. Please login instead of Signup");
  }

  const isVerified = req.cookies?.isEmailVerified;
  if (!isVerified) {
    throw new APIERR(400, "Please verify your email");
  }

  const createUser = await User.create({
    fullName,
    email,
    mobileNumber,
    password,
    role,
    rollNumber,
    dob,
  });

  const createdUser = await User.findOne(createUser._id).select(
    "-password -refreshToken"
  );

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    createUser._id
  );

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    maxAge: 1000 * 60 * 60 * 24,
  };

  res.cookie("accessToken", accessToken, cookieOptions);
  res.cookie("refreshToken", refreshToken, cookieOptions);

  if (!accessToken) {
    throw new APIERR(502, "Internal Server ERR! While setting the accesstoken");
  }

  // Welcome email HTML
  const welcomeHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
      <div style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">

        <!-- Header -->
        <div style="background-color: ${process.env.BRAND_COLOR}; padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 26px;">${process.env.APP_NAME}</h1>
        </div>

        <!-- Body -->
        <div style="padding: 30px;">
          <h2 style="color: #333333; font-size: 22px;">Welcome, ${fullName}! 🎉</h2>
          <p style="color: #555555; font-size: 15px; line-height: 1.7;">
            We're thrilled to have you on board. Your account has been successfully created.
            Here's a quick summary of your account details:
          </p>

          <!-- Account Details Box -->
          <div style="background-color: #f9f9f9; border-left: 4px solid ${process.env.BRAND_COLOR}; border-radius: 6px; padding: 16px; margin: 20px 0;">
            <p style="margin: 6px 0; color: #444; font-size: 14px;"><strong>Name:</strong> ${fullName}</p>
            <p style="margin: 6px 0; color: #444; font-size: 14px;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 6px 0; color: #444; font-size: 14px;"><strong>Role:</strong> ${role}</p>
            <p style="margin: 6px 0; color: #444; font-size: 14px;"><strong>Roll Number:</strong> ${rollNumber}</p>
          </div>

          <p style="color: #555555; font-size: 15px; line-height: 1.7;">
            You can now log in and explore everything ${process.env.APP_NAME} has to offer.
          </p>

          <!-- CTA Button -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.APP_URL}"
              style="background-color: ${process.env.BRAND_COLOR}; color: #ffffff; padding: 14px 32px;
                     text-decoration: none; border-radius: 6px; font-size: 15px; font-weight: bold;">
              Go to Dashboard
            </a>
          </div>

          <p style="color: #555555; font-size: 15px; line-height: 1.7;">
            If you have any questions, feel free to reach out to our
            <a href="${process.env.SUPPORT_URL}" style="color: ${process.env.BRAND_COLOR}; text-decoration: none;">support team</a>.
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
      `Welcome to ${process.env.APP_NAME}, ${fullName}!`,
      welcomeHtml
    );
    console.log("Welcome email sent");
  } catch (error) {
    console.error("ERR while sending welcome email:", error);
  }

  res
    .status(200)
    .json(
      new APIRES(200, { user: createdUser }, "Successfully Created the User")
    );
});

const login = asynchandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new APIERR(400, "Please fill the required Fields");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new APIERR(
      400,
      "No account found with this mail. Please Signup first"
    );
  }

  // Match the password
  const isPasswordCorrect = await user.isPasswordValid(password);
  if (!isPasswordCorrect) throw new APIERR(400, "Wrong Password");

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    maxAge: 1000 * 60 * 60 * 24,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    maxAge: 1000 * 60 * 60 * 24,
  });
  res.status(200).json(
    new APIRES(
      200,
      {
        user: {
          _id: user._id,
          role: user.role,
        },
        accessToken,
      },
      "Successfully logged in"
    )
  );
});

const logout = asynchandler(async (req, res) => {
  res.cookie("refreshToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    maxAge: 0,
  });

  res.cookie("accessToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    maxAge: 0,
  });

  // Clear user cache on logout
  if (req.user?._id) {
    await cacheDeletePattern(`${CACHE_KEYS.USER_STATS}${req.user._id}*`);
    await cacheDeletePattern(`${CACHE_KEYS.USER_DASHBOARD}${req.user._id}*`);
  }

  return res.status(200).json(new APIRES(200, "Successfully logged out"));
});

const refreshAccessToken = asynchandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken;
  if (!incomingRefreshToken) {
    throw new APIERR(401, "No refresh token found. Please login again");
  }

  // Verify refresh token signature
  let decoded;
  try {
    decoded = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
  } catch (err) {
    throw new APIERR(401, "Invalid or expired refresh token");
  }

  // Find user
  const user = await User.findById(decoded._id);
  if (!user) {
    throw new APIERR(404, "User not found");
  }

  //  Compare hashed refresh token
  const isMatch = await user.compareRefreshToken(incomingRefreshToken);
  if (!isMatch) {
    throw new APIERR(401, "Refresh token mismatch. Please login again");
  }

  //  Generate new pair
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  //  Send cookies
  return res
    .status(200)
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: 1000 * 60 * 60 * 24,
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: 1000 * 60 * 60 * 24,
    })
    .json(
      new APIRES(200, { accessToken }, "Access token refreshed successfully")
    );
});

const changeCurrentPassword = asynchandler(async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  if (!oldPassword || !newPassword || !confirmPassword) {
    throw new APIERR(400, "Please provide the required fields");
  }

  if (newPassword.length < 6 || confirmPassword.length < 6) {
    throw new APIERR(400, "Password must be at least 6 characters long");
  }

  if (newPassword !== confirmPassword) {
    throw new APIERR(400, "New Password and Confirm Password must be same");
  }

  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new APIERR(404, "User not found");
  }
  const isOldPasswordCorrect = await user.isPasswordValid(oldPassword);
  if (!isOldPasswordCorrect) {
    throw new APIERR(400, "Old Password is incorrect");
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  // Clear user session cache after password change
  if (req.user?._id) {
    await cacheDeletePattern(`${CACHE_KEYS.USER_STATS}${req.user._id}*`);
  }

  return res
    .status(200)
    .json(new APIRES(200, user, "Password changed successfully"));
});

const userDetails = asynchandler(async (req, res) => {
  const token = req.cookies?.accessToken;
  if (!token) throw new APIERR(401, "No access token");

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (e) {
    throw new APIERR(401, "Invalid or expired access token");
  }

  const userId = decoded._id;
  if (!userId) throw new APIERR(401, "Invalid token payload");

  const user = await User.findById(userId)
    .select("-password -refreshToken")
    .lean();

  if (!user) throw new APIERR(404, "User not found");

  const totalContest = await Test.find({}).countDocuments();

  const totalContestsGiven = await SubmittedOption.countDocuments({
    user: userId,
  });

  // Fetch all leaderboards where the user is present
  const leaderboards = await Leaderboard.find({ "data.user": userId }).lean();

  // Calculate best rank
  let bestRank = null;
  for (const lb of leaderboards) {
    const sortedData = lb.data.sort((a, b) => b.score - a.score); // Higher score = better rank
    const rank =
      sortedData.findIndex(
        (entry) => entry.user.toString() === userId.toString()
      ) + 1;
    if (!bestRank || rank < bestRank) bestRank = rank;
  }

  const profilePicUrl =
    user?.profilePic?.url.trim() && user.profilePic.url.trim() !== ""
      ? user.profilePic.url.trim()
      : null;

  return res.status(200).json(
    new APIRES(
      200,
      {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          profilePic: profilePicUrl,
          since: new Date(user.createdAt).toLocaleString("default", {
            month: "long",
            year: "numeric",
          }),
          college: user.college,
          dob: user.dob,
          bio: user.bio,
          role: user.role,
          totalContestsGiven,
          bestRank: bestRank || "N/A",
          totalContestsAvailable: totalContest,
        },
      },
      "User fetched"
    )
  );
});

const checkAuth = (req, res) => {
  if (!req.user) {
    throw new APIERR(401, "User not authenticated");
  }
  return res.status(200).json(req.user);
};

export {
  signup,
  login,
  logout,
  checkAuth,
  generateAccessAndRefreshTokens,
  refreshAccessToken,
  changeCurrentPassword,
  userDetails,
};
